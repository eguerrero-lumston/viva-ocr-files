import { Location } from '@angular/common';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Suggestions } from './../../model/suggestion';
import { File } from './../../model/file';
import { Folder } from './../../model/folder';
import { ConnectServer } from './../../api/connect-server';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-manifest-flight',
  templateUrl: './manifest-flight.component.html',
  styleUrls: ['./manifest-flight.component.scss']
})
export class ManifestFlightComponent implements OnInit {
  searchForm: FormGroup;
  searchFormFiles: FormGroup;
  nameSearchFilter = new FormControl();
  breadcrumbs = [];
  isInFolder = false;
  date = moment().format('YYYY-MM-DD');
  hour = moment().format('hh:mm a');
  selectedSupervisor = 'Todas';

  folderName = '';
  suggestions = new Suggestions();
  folders: string[] = [];
  foldersTemp: string[] = [];
  filesTemp: File[] = [];
  files: File[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restApi: ConnectServer,
    private location: Location,
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
    this.folders = [];
    this.foldersTemp = [];
    this.filesTemp = [];
    this.files = [];
    this.route.params
      .subscribe((params: Params) => {
        // console.log('parametros', params);
        if (params.name) {
          this.folderName = params.name;
          this.restApi.getFolder(this.folderName).subscribe(res => {
            if (res) {
              // console.log(res);
              this.breadcrumbs = this.folderName.split('/').filter(name => name !== '');
              this.folders = res.folders;
              this.files = res.files;
            }
          });
        } else {
          this.folderName = '';
          this.restApi.getFolders().subscribe((data) => {
            // console.log('folders--->', data);
            this.breadcrumbs.length = 0;
            this.folders = data.folders;
            this.foldersTemp = data.folders;
            this.files = data.files;
          });
        }
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
        this.files = this.filesTemp.filter(file => {
          file.name.includes(name);
        });
        this.folders = this.foldersTemp.filter(name => {
          name.includes(name);
        });
      } else {
        this.files = this.filesTemp;
        this.folders = this.foldersTemp;
      }
    });
  }

  viewFolder(name) {
    this.folderName = `${this.folderName}/${name}`;
    this.router.navigate(['/repository', { name: this.folderName }], { relativeTo: this.route });

  }

  returnHome(breadcrumb: string) {
    const breads = this.folderName.split('/').filter(name => name !== '');
    const index = breads.indexOf(breadcrumb);
    breads.splice(index + 1, breads.length);
    const link = '/' + breads.toString().replace(',', '/');
    // console.log( link, breads);
    // console.log(breadcrumb);
    // this.location.back();
    // this.folderName
    let qp = { name: link };
    // this.router.navigate(['/view'], {  queryParams: qp,skipLocationChange: true });
    if (breads.length !== 1) {
      this.router.navigate(['/repository'], { queryParams: qp, relativeTo: this.route, skipLocationChange: true });
    } else {
      this.router.navigate(['/repository', { name: '' }], { relativeTo: this.route, skipLocationChange: true });
    }
  }

  viewDataManifest(file: File) {
    console.log('fileeee', file);
    this.router.navigate(['./manifest-viewer', { key: file.key, isRepository: true }], { queryParams: {}, relativeTo: this.route });
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
