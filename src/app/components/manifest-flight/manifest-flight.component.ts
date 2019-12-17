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
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-manifest-flight',
  templateUrl: './manifest-flight.component.html',
  styleUrls: ['./manifest-flight.component.scss']
})
export class ManifestFlightComponent implements OnInit {
  searchForm: FormGroup;
  searchFormFiles: FormGroup;
  nameSearchFilter = new FormControl();
  isLoading = false;
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
    private formBuilder: FormBuilder,
    private config: NgSelectConfig) {
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
    this.configNgSelect();
  }

  ngOnInit() {
    this.isLoading = true;
    this.folders = [];
    this.foldersTemp = [];
    this.files = [];
    this.filesTemp = [];
    this.route.params
      .subscribe((params: Params) => {
        // console.log('parametros', params);
        if (params.name) {
          this.folderName = params.name;
          this.restApi.getFolder(this.folderName).subscribe(res => {
            if (res) {
              // console.log(res);
              this.isLoading = false;
              this.breadcrumbs = this.folderName.split('/').filter(name => name !== '');
              this.folders = res.folders;
              this.files = res.files;
            }
          }, error => {
            this.isLoading = false;
          });
        } else {
          this.folderName = '';
          this.breadcrumbs = [];
          this.restApi.getFolders().subscribe((data) => {
            // console.log('folders--->', data);
            this.breadcrumbs = [];
            this.isLoading = false;
            this.folders = data.folders;
            this.foldersTemp = data.folders;
            // console.log('this.foldersTemp', this.foldersTemp);
            this.files = data.files;
          }, error => {
            this.isLoading = false;
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
          // console.log('values------>', values, this.searchForm.valid, this.searchForm.invalid);
          // console.log('this.validateValues()', this.validateValues());
          if (this.validateValues()) {
            //   this.nameSearch.setValue(name);
            return this.restApi.getFoldersFilter(this.searchForm.value);
          } else {
            this.isInFolder = false;
            this.files = [];
            this.folderName = '';
            this.breadcrumbs = [];
            // console.log('this.foldersTemp', this.foldersTemp);
            this.folders = this.foldersTemp;
            return [];
          }
        })
      ).subscribe(res => {
        // console.log('res', res);
        this.isInFolder = true;
        this.folders = [];
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
        this.folders = this.foldersTemp.filter(nameF => {
          name.includes(nameF);
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
    const qp = { name: link };
    // this.router.navigate(['/view'], {  queryParams: qp,skipLocationChange: true });
    if (breads.length !== 1) {
      this.router.navigate(['/repository'], { queryParams: qp, relativeTo: this.route, skipLocationChange: true });
    } else {
      this.router.navigate(['/repository', { name: '' }], { relativeTo: this.route, skipLocationChange: true });
    }
  }

  viewDataManifest(file: File) {
    // console.log('fileeee', file);
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
  configNgSelect() {
    this.config.notFoundText = 'Vacio';
    this.config.appendTo = 'body';
    this.config.addTagText = 'Agregar';
    // set the bindValue to global config when you use the same
    // bindValue in most of the place.
    // You can also override bindValue for the specified template
    // by defining `bindValue` as property
    // Eg : <ng-select bindValue="some-new-value"></ng-select>
    this.config.bindValue = 'value';
  }
}
