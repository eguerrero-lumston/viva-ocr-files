import { MatSort } from '@angular/material/sort';
import { ReportDetail } from './../../model/report-detail';
import { MatTableDataSource } from '@angular/material/table';
import { Report } from './../../model/report';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FormComponent } from './../form/form.component';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ConnectServer } from './../../api/connect-server';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-compliance-report',
  templateUrl: './compliance-report.component.html',
  styleUrls: ['./compliance-report.component.scss']
})
export class ComplianceReportComponent implements OnInit {
  searchForm: FormGroup;
  searchFormReport: FormGroup;
  nameSearchFilter = new FormControl();
  isLoading = false;

  displayedColumns: string[] = ['airport', 'noGenerated', 'generated', 'total', 'percent'];
  dataSource = new MatTableDataSource<Report>();
  dataSourceTemp: Report[];
  @ViewChild('TABLE', { static: true }) table: ElementRef;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  reportsDetails: ReportDetail[] = [];
  isReportView = false;

  generalDisplayedColumns: string[] = ['name', 'manifest', 'percent'];
  dataSourceGeneral = [
    { name: 'escaneado', manifest: 0, percent: 0 },
    { name: 'no escaneado', manifest: 0, percent: 0 },
    { name: 'total', manifest: 0, percent: 0 },
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restApi: ConnectServer,
    private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      airline: ['VIV', Validators.required],
      start: [new Date(), Validators.required],
      end: [new Date(), Validators.required],
      manifestType: ['destination', Validators.required]
    });

    this.searchFormReport = this.formBuilder.group({
      nameSearch: this.nameSearchFilter
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.sort.start = 'asc';
    this.dataSource.sort = this.sort;
    const type = this.searchForm.value.manifestType ? this.searchForm.value.manifestType : 'origin';
    const start = moment(this.searchForm.value.start);
    const end = moment(this.searchForm.value.end);
    // console.log(type, start.format(), end.format());
    this.restApi.getReports(type, start, end).subscribe(res => {
      // console.log('res', res);
      this.dataSource.data = res.flights;
      this.dataSourceTemp = res.flights;
      this.configGeneral(res);
      this.isLoading = false;
      this.dataSource._updateChangeSubscription(); // <-- Refresh the datasource
    }, error => {
      this.isLoading = false;
    });
    this.initListeners();
  }

  initListeners() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(values => {
          // console.log('values------>', values, this.searchForm.valid, this.searchForm.invalid);
          // console.log('this.validateValues()', values.start);
          const type = values.manifestType ? values.manifestType : 'origin';
          const start = moment(this.searchForm.value.start);
          const end = moment(this.searchForm.value.end);
          return this.restApi.getReports(type, start, end);
        })
      ).subscribe(res => {
        // console.log('res', res);
        this.dataSource.data = res.flights;
        this.configGeneral(res);
      });

    this.dataSource.filterPredicate = this.customFilterPredicate();
    this.nameSearchFilter.valueChanges.subscribe(name => {
      this.dataSource.filter = name;
    });
  }

  customFilterPredicate() {
    const myFilterPredicate = (data: Report, filter: string): boolean => {
      const arrayNames = filter.split(',');
      let filters = arrayNames;
      filters = filters.map(name => {
        return name.trim().toLowerCase();
      });
      return filters.includes(data.airport.toString().trim().toLowerCase());
    };
    return myFilterPredicate;
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

  dateFilter(date: Date, isStart) {
    return date < new Date();
  }

  configGeneral(res: any) {
    this.dataSourceGeneral[0].manifest = res.general.generated.manifest;
    this.dataSourceGeneral[0].percent = res.general.generated.percent;
    this.dataSourceGeneral[1].manifest = res.general.noGenerated.manifest;
    this.dataSourceGeneral[1].percent = res.general.noGenerated.percent;
    this.dataSourceGeneral[2].manifest = res.general.total.manifest;
    this.dataSourceGeneral[2].percent = res.general.total.percent;
  }

  exportAsExcel() {
    // console.log('XLSX', this.table);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement); // converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');

    /* save to file */
    const start = moment(this.searchForm.value.start).format('DD/MM/YYYY');
    const end = moment(this.searchForm.value.end).format('DD/MM/YYYY');
    console.log(`Reporte-${start} a ${end}.xlsx`);
    XLSX.writeFile(wb, `Reporte-${start} a ${end}.xlsx`);
  }

  viewNoGenerated(element) {
    // console.log(element);
    const type = this.searchForm.value.manifestType || 'origin';
    const start = moment(this.searchForm.value.start);
    const end = moment(this.searchForm.value.end);
    const airport = element.airport;
    this.restApi.getNoGenerated(type, airport, start, end).subscribe(res => {
      // console.log(element, res);
      this.reportsDetails = res;
      this.isReportView = true;
    });
  }
}
