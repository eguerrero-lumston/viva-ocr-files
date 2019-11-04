import { debounceTime, switchMap } from 'rxjs/operators';
import { Suggestions } from './../../model/suggestion';
import { File } from './../../model/file';
import { Folder } from './../../model/folder';
import { ConnectServer } from './../../api/connect-server';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-manifest-flight',
  templateUrl: './manifest-flight.component.html',
  styleUrls: ['./manifest-flight.component.scss']
})
export class ManifestFlightComponent implements OnInit {
  searchForm: FormGroup;
  breadcrumbs = [];
  isInFolder = false;
  date = new FormControl(moment().date());
  hour = new FormControl('12:02');
  acronym = new FormControl();
  registration = new FormControl();
  origin = new FormControl();
  destination = new FormControl();

  selectedSupervisor = 'Todas';
  serializedDate = new FormControl((new Date()).toISOString());

  suggestions = new Suggestions();
  folders: string[] = [];
  files: File[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private restApi: ConnectServer,
              private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      date: this.date,
      hour: this.hour,
      acronym: this.acronym,
      registration: this.registration,
      origin: this.origin,
      destination: this.destination,
    });
  }

  ngOnInit() {
    this.restApi.getFolders().subscribe((data) => {
      console.log('folders--->', data);
      this.folders = data.folders;
      this.files = data.files;
    });
    this.restApi.getSuggestions().subscribe(res => {
      if (res) {
        this.suggestions = res;
      }
    });
    this.initListeners();
  }

  initListeners(){
    this.searchForm.valueChanges
    .pipe(
      debounceTime(1000),
      switchMap(values => {
        console.log('values------>', values);
        // if (name !== '') {
        //   this.nameSearch.setValue(name);
        return this.restApi.getFoldersFilter(this.searchForm.value);
        // } else {
        //   this.configDefault();
        // }
        return [];
      })
    ).subscribe(res => {
      console.log('res', res);
    });
  }
  viewFolder(item) {
    this.restApi.getFolder(item).subscribe(res => {
      if (res) {
        console.log(res);
        this.breadcrumbs.push(item);
        this.isInFolder = true;
        this.files = res.files;
      }
    });
  }

  returnHome() {
      this.breadcrumbs.pop();
      this.isInFolder = false;
      this.files.length = 0;
  }

  viewDataManifest(name: string) {
    this.router.navigate(['./manifest-viewer', { name }], { relativeTo: this.route });
  }
}
