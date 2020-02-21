import { LocalStorageService } from '../../util/local-storage.service';
import { FilePaginatorResponse } from '../../model/request/file-paginator-response';
import { GlobalVariable } from '../../global/global';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { File } from '../../model/file/file';
import { DialogConfirmComponent } from '../../single-components/dialog-confirm/dialog-confirm.component';
import { NotificationService } from '../../api/notification.service';
import { Router, ActivatedRoute, Event } from '@angular/router';
import { ConnectServer } from '../../api/connect-server';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { debounceTime, switchMap } from 'rxjs/operators';
import { state } from '@angular/animations';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
  providers: [GlobalVariable]
})
export class DatatableComponent implements OnInit {
  dataSource = new MatTableDataSource<File>();
  temp = new FilePaginatorResponse();
  isLoading = false;
  fileToSend = new Set<File>();
  displayedColumns: string[] = [
    'year',
    'fatherLastname',
    'motherLastname',
    'name',
    'position',
    'checkStatus',
    'actions'
  ];
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
    private localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    private notificationservice: NotificationService,
    public globalVariable: GlobalVariable) {
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
    this.restApi.getFiles().subscribe((data) => {
      // console.log('ngOnInit', data);
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
            // this.nameSearch.setValue(name);
            return this.restApi.getFileFilter(this.paginator, this.nameSearch.value, this.status.toString());
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

  onDelete(row: File) {
    // console.log(row);
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Confirma',
        message: `¿Deseas eliminar el expediente ${row.name}?`,
        btnOkText: 'Si, eliminar',
        btnCancelText: 'No, mantener'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.restApi.deleteFile(row.jobId).subscribe(res => {
          if (res) {
            this.localStorageService.delete(row.jobId);
            this.localStorageService.delete(row.key);
            this.notificationservice.showSuccess('Correcto', 'se elimino correctamente');
            const index = this.dataSource.data.indexOf(row);
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription(); // <-- Refresh the datasource
          }
        });
      }
    });
  }

  onEdit(file: File, isConfirmed = false) {
    // console.log(row);
    const jobId = file.jobId;
    this.router.navigate(['./form', { jobId, isConfirmed }], { relativeTo: this.route });
  }

  onConfirmArray() {
    // console.log('onConfirmArray');
    if (this.fileToSend.size <= 0) {
      return;
    }
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Confirma',
        message: `¿Deseas confirmar ${this.fileToSend.size} expediente${this.fileToSend.size > 1 ? 's' : ''}?`,
        btnOkText: 'Si, confirmar',
        btnCancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.fileToSend.forEach(file => {
          if (file.checkStatus === this.globalVariable.STATUS_GREEN) {
            this.restApi.confirmFile(file.jobId).subscribe(res => {
              if (res) {
                this.notificationservice.showSuccess('Correcto!', `Se ha confirmado ${file.name} correctamente`);
                this.fileToSend.delete(file);
                const index = this.dataSource.data.indexOf(file);
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

  onCheckIsPressed(file: File, check: MatCheckbox) {
    // console.log(file, check.checked);
    if (file.checkStatus !== this.globalVariable.STATUS_GREEN) {
      return;
    }
    if (check.checked) {
      this.fileToSend.delete(file);
    } else {
      this.fileToSend.add(file);
    }
    // console.log(this.fileToSend);
  }

  updateFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getFileFilter(event?: PageEvent) {
    if (event) {
      this.page = event.pageIndex + 1;
      this.total = event.pageSize;
    } else {
      this.page = 1;
      this.total = this.paginator.pageSize;
    }
    // console.log('getFileFilter', this.page, this.status.toString());
    this.restApi.getFileFilter(this.paginator,
      this.nameSearch.value, this.status.toString()).subscribe(res => {
        // console.log('filter', res);
        // this.temp.data = this.dataSource.data;
        this.total = res.total;
        this.limit = res.limit;
        this.page = res.page - 1;
        this.dataSource.data = res.docs;
      });
  }

  changeStatus() {
    this.fileToSend.clear();
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
    // console.log('this.status', this.status);
    if (this.status.length > 0) {
      this.getFileFilter();
    } else {
      this.configDefault();
    }
  }
}
