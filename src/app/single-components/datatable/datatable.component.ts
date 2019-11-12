import { ManifestPaginatorResponse } from '../../model/request/manifest-paginator-response';
import { GlobalVariable } from './../../global/global';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Manifest } from './../../model/manifest/manifest';
import { DialogConfirmComponent } from './../dialog-confirm/dialog-confirm.component';
import { NotificationService } from './../../api/notification.service';
import { Router, ActivatedRoute, Event } from '@angular/router';
import { ConnectServer } from './../../api/connect-server';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { debounceTime, switchMap } from 'rxjs/operators';
import { state } from '@angular/animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
  providers: [GlobalVariable]
})
export class DatatableComponent implements OnInit {
  dataSource = new MatTableDataSource<Manifest>();
  temp = new ManifestPaginatorResponse();
  isLoading = false;
  manifestToSend = new Set<Manifest>();
  displayedColumns: string[] = ['name', 'uploaded_at', 'checkStatus', 'actions'];
  total = 0;
  limit = 10;
  page = 0;
  pageEvent: PageEvent;

  nameSearch = new FormControl();
  searchForm: FormGroup;
  isYellow = false;
  isBlue = false;
  isGreen = false;
  isPurple = false;
  status = [''];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private restApi: ConnectServer,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private notificationservice: NotificationService,
    private globalVariable: GlobalVariable) {
    moment.locale('es');
    this.searchForm = this.formBuilder.group({
      nameSearch: this.nameSearch
    });
  }

  ngOnInit() {
    this.isLoading = true;
    // console.log(this.paginator);
    this.total = 0;
    this.limit = 10;
    this.page = 0;
    this.isYellow = false;
    this.isBlue = false;
    this.isGreen = false;
    this.isPurple = false;
    this.status = [''];
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.restApi.getManifests().subscribe((data) => {
      console.log('ngOnInit', data);
      this.temp = data;
      this.isLoading = false;
      this.dataSource.data = data.docs;
      this.total = data.total;
      this.limit = data.limit;
      this.page = data.page - 1;
    }, error => {
      this.isLoading = false;
    });

    this.nameSearch.valueChanges
      .pipe(
        debounceTime(1000),
        switchMap(name => {
          if (name !== '') {
            this.nameSearch.setValue(name);
            return this.restApi.getManifestFilter(this.paginator, this.nameSearch.value, this.status.toString());
          } else {
            this.configDefault();
          }
          return [];
        })
      ).subscribe(res => {
        this.total = res.total;
        this.limit = res.limit;
        this.page = res.page - 1;
        this.dataSource.data = res.docs;
      });
  }

  configDefault() {
    this.dataSource.data = this.temp.docs;
    this.total = this.temp.total;
    this.limit = this.temp.limit;
    this.page = this.temp.page - 1;
  }
  getDateFormat(date: string) {
    const dateRaw = moment(date);
    return dateRaw.format('DD-MM-YYYY');
  }

  onDelete(row: Manifest) {
    // console.log(row);
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Confirma',
        message: `¿Deseas eliminar el manifiesto ${row.name}?`,
        btnOkText: 'Si, eliminar',
        btnCancelText: 'No, mantener'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.restApi.deleteManifest(row.jobId).subscribe(res => {
          if (res) {
            this.notificationservice.showSuccess('Correcto', 'se elimino correctamente');
            const index = this.dataSource.data.indexOf(row);
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription(); // <-- Refresh the datasource
          }
        });
      }
    });
  }

  onEdit(manifest: Manifest) {
    // console.log(row);
    const jobId = manifest.jobId;
    this.router.navigate(['./form', { jobId }], { relativeTo: this.route });
  }

  onConfirmArray() {
    console.log('onConfirmArray');
    if (this.manifestToSend.size <= 0) {
      return;
    }
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Confirma',
        message: `¿Deseas confirmar ${this.manifestToSend.size} manifiesto${this.manifestToSend.size > 1 ? 's' : ''}?`,
        btnOkText: 'Si, confirmar',
        btnCancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.manifestToSend.forEach(manifest => {
          if (manifest.checkStatus === this.globalVariable.STATUS_GREEN) {
            this.restApi.confirmManifest(manifest.jobId).subscribe(res => {
              if (res) {
                this.notificationservice.showSuccess('Correcto!', `Se ha confirmado ${manifest.name} correctamente`);
                this.manifestToSend.delete(manifest);
                const index = this.dataSource.data.indexOf(manifest);
                this.dataSource.data.splice(index, 1);
                this.dataSource._updateChangeSubscription(); // <-- Refresh the datasource
              }
            });
          }
        });
      }
    });

  }

  customSort(event: { active: string, direction: string }) {

  }

  onCheckIsPressed(manifest: Manifest, check: MatCheckbox) {
    // console.log(manifest, check.checked);
    if (manifest.checkStatus !== this.globalVariable.STATUS_GREEN) {
      return;
    }
    if (check.checked) {
      this.manifestToSend.delete(manifest);
    } else {
      this.manifestToSend.add(manifest);
    }
    // console.log(this.manifestToSend);
  }

  updateFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getManifestFilter(event?: PageEvent) {
    if (event) {
      this.page = event.pageIndex + 1;
      this.total = event.pageSize;
    } else {
      this.page = 1;
      this.total = this.paginator.pageSize;
    }
    console.log('getManifestFilter', this.page, this.status.toString());
    this.restApi.getManifestFilter(this.paginator,
      this.nameSearch.value, this.status.toString()).subscribe(res => {
        console.log('filter', res);
        // this.temp.data = this.dataSource.data;
        this.total = res.total;
        this.limit = res.limit;
        this.page = res.page - 1;
        this.dataSource.data = res.docs;
      });
  }

  changeStatus() {
    const status = [];
    if (this.isYellow) {
      status.push(this.globalVariable.STATUS_YELLOW);
    }

    if (this.isBlue) {
      status.push(this.globalVariable.STATUS_BLUE);
    }
    if (this.isGreen) {
      status.push(this.globalVariable.STATUS_GREEN);
    }

    if (this.isPurple) {
      status.push(this.globalVariable.STATUS_CONFIRMED);
    }
    this.status = status;
    console.log('this.status', this.status);
    if (this.status.length > 0) {
      this.getManifestFilter();
    } else {
      this.configDefault();
    }
  }
}
