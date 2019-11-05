import { debounceTime, switchMap } from 'rxjs/operators';
import { Suggestions } from './../../model/suggestion';
import { File } from './../../model/file';
import { Folder } from './../../model/folder';
import { ConnectServer } from './../../api/connect-server';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  date = moment().format('YYYY-MM-DD');
  hour = moment().format('hh:mm a');
  acronym = new FormControl('');
  registration = new FormControl('');
  origin = new FormControl('');
  destination = new FormControl('');

  selectedSupervisor = 'Todas';

  suggestions = new Suggestions();
  folders: string[] = [];
  foldersTemp: string[] = [];
  filesTemp: File[] = [];
  files: File[] = [];

  nameSearchFilter = new FormControl();
  searchFormFiles: FormGroup;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private restApi: ConnectServer,
              private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      date: [null, Validators.required],
      hour: [null, Validators.required],
      acronym: [null, Validators.required],
      registration: [null, Validators.required],
      origin: [null, Validators.required],
      destination: [null, Validators.required],
    });

    this.searchFormFiles = this.formBuilder.group({
      nameSearch: this.nameSearchFilter
    });
  }

  ngOnInit() {
    this.restApi.getFolders().subscribe((data) => {
      console.log('folders--->', data);
      this.folders = data.folders;
      this.foldersTemp = data.folders;
      this.files = data.files;
    });
    this.restApi.getSuggestions().subscribe(res => {
      if (res) {
        this.suggestions = res;
      }
    });
    this.initListeners();
  }

  initListeners() {
    this.searchForm.valueChanges
    .pipe(
      debounceTime(500),
      switchMap(values => {
        console.log('values------>', values, this.searchForm.valid, this.searchForm.invalid);
        console.log('this.validateValues()', this.validateValues());
        if (this.validateValues()) {
        //   this.nameSearch.setValue(name);
          return this.restApi.getFoldersFilter(this.searchForm.value);
        } else {
          this.isInFolder = false;
          this.files.length = 0;
          this.folders = this.foldersTemp;
          return [];
        }
      })
    ).subscribe(res => {
      console.log('res', res);
      this.isInFolder = true;
      this.files = res;
      if (res) {
        this.filesTemp = res;
      }
    });

    this.nameSearchFilter.valueChanges.subscribe(name => {
      if (name !== '') {
        if (this.isInFolder){
          this.files = this.filesTemp.filter(file => {
              file.name.includes(name);
          });
        } else {
          this.folders = this.foldersTemp.filter(name => {
              name.includes(name);
          });
        }
       } else {
        this.files = this.filesTemp;
      }
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

  validateValues() {
    return this.searchForm.get('date').valid ||
    this.searchForm.get('hour').valid ||
    this.searchForm.get('acronym').valid ||
    this.searchForm.get('registration').valid ||
    this.searchForm.get('origin').valid ||
    this.searchForm.get('destination').valid;
  }
}
