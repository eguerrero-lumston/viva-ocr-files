import { debounceTime, switchMap } from 'rxjs/operators';
import { FormComponent } from './../form/form.component';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ConnectServer } from './../../api/connect-server';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-compliance-report',
  templateUrl: './compliance-report.component.html',
  styleUrls: ['./compliance-report.component.scss']
})
export class ComplianceReportComponent implements OnInit {
  searchForm: FormGroup;
  searchFormReport: FormGroup;
  nameSearchFilter = new FormControl();

  displayedColumns: string[] = ['name', 'position', 'weight', 'symbol', 'percent'];
  dataSource = [
    {position: 1, name: 'HYD', weight: 19, symbol: 13},
    {position: 2, name: 'HEL', weight: 46, symbol: 1},
    {position: 3, name: 'LIT', weight: 63, symbol: 56},
    {position: 4, name: 'BER', weight: 95, symbol: 58},
    {position: 5, name: 'BOR', weight: 100, symbol: 84},
    {position: 6, name: 'CAR', weight: 27, symbol: 28},
    {position: 7, name: 'NIT', weight: 47, symbol: 5},
    {position: 8, name: 'OXY', weight: 100, symbol: 48},
    {position: 9, name: 'FLU', weight: 88, symbol: 96},
    {position: 10, name: 'NEO', weight: 77, symbol: 4},
  ];
  dataSourceTemp = this.dataSource;

  generalDisplayedColumns: string[] = ['name', 'generate', 'percent'];
  dataSourceGeneral = [
    { name: 'generado', generate: 195, percent: 96.53 },
    { name: 'no generado', generate: 7, percent: 3.47 },
    { name: 'total', generate: 201, percent: 100.00 },
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restApi: ConnectServer,
    private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      start: [new Date(), Validators.required],
      finish: [new Date(), Validators.required],
      manifestType: '1'
    });

    this.searchFormReport = this.formBuilder.group({
      nameSearch: this.nameSearchFilter
    });
  }

  ngOnInit() {
    this.initListeners();
  }

  initListeners() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(values => {
          console.log('values------>', values, this.searchForm.valid, this.searchForm.invalid);
          console.log('this.validateValues()');
          // if (this.validateValues()) {
          //   //   this.nameSearch.setValue(name);
          //   return this.restApi.getFoldersFilter(this.searchForm.value);
          // } else {
          //   this.isInFolder = false;
          //   this.files.length = 0;
          //   this.folders = this.foldersTemp;
            return [];
          // }
        })
      ).subscribe(res => {
        console.log('res', res);
        // this.isInFolder = true;
        // this.files = res;
        // if (res) {
        //   this.filesTemp = res;
        // }
      });
    this.nameSearchFilter.valueChanges.subscribe(name => {
      if (name !== '') {
        // if (this.isInFolder) {
          this.dataSource = this.dataSourceTemp.filter(report => {
            report.name.includes(name);
          });
        // } else {
          // this.folders = this.foldersTemp.filter(name => {
          //   name.includes(name);
          // });
        // }
      } else {
        this.dataSource = this.dataSourceTemp;
      }
    });
  }

  getClassRow(percent: number) {
    if (percent > 90) {
      return 'row-green';
    } else if (percent > 50 && percent < 90) {
      return 'row-yellow';
    } else if (percent < 50) {
      return 'row-red';
    }
  }
}
