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
  searchFormFiles: FormGroup;
  nameSearchFilter = new FormControl();

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];

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

    this.searchFormFiles = this.formBuilder.group({
      nameSearch: this.nameSearchFilter
    });
  }

  ngOnInit() {
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
