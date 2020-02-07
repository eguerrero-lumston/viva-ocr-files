import { DocTypesRequest } from './../../model/request/doc-types-request';
import { DocType } from './../../model/doc-type';
import { LocalStorageService } from '../../util/local-storage.service';
import { GlobalVariable } from '../../global/global';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
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
import { Observable } from 'rxjs';

@Component({
  selector: 'app-doc-type',
  templateUrl: './doc-type.component.html',
  styleUrls: ['./doc-type.component.css']
})
export class DocTypeComponent implements OnInit {
  dataSource = new MatTableDataSource<DocType>();
  temp = new DocTypesRequest();
  isLoading = false;
  displayedColumns: string[] = [
    'name',
    'textToRecognize',
    'actions'
  ];
  total = 0;
  limit = 10;
  page = 0;
  pageEvent: PageEvent;

  nameSearch = new FormControl();
  searchForm: FormGroup;
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.restApi.getDocTypes().subscribe((data) => {
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
            return this.restApi.getDocTypesFilter(this.paginator, this.nameSearch.value);
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

  onDelete(row: DocType) {
    // console.log(row);
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Confirma',
        message: `¿Deseas eliminar el tipo de documento ${row.name}?`,
        btnOkText: 'Si, eliminar',
        btnCancelText: 'No, mantener'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.restApi.deleteDocType(row._id).subscribe(res => {
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

  onEdit(docType: DocType) {
    // console.log(row);
    const id = docType._id;
    this.router.navigate(['./new', { id }], { relativeTo: this.route });
  }

  customSort(event: { active: string, direction: string }) {

  }

  updateFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getDocTypeFilter(event?: PageEvent) {
    if (event) {
      this.page = event.pageIndex + 1;
      this.total = event.pageSize;
    } else {
      this.page = 1;
      this.total = this.paginator.pageSize;
    }
    // console.log('getDocTypeFilter', this.page, this.status.toString());
    this.restApi.getDocTypesFilter(this.paginator,
      this.nameSearch.value).subscribe(res => {
        // console.log('filter', res);
        // this.temp.data = this.dataSource.data;
        this.total = res.total;
        this.limit = res.limit;
        this.page = res.page - 1;
        this.dataSource.data = res.docs;
      });
  }
}
