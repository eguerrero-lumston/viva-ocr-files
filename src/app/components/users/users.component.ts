import { User } from 'src/app/model/user';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogConfirmComponent } from '../../single-components/dialog-confirm/dialog-confirm.component';
import { NotificationService } from '../../api/notification.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConnectServer } from '../../api/connect-server';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  total = 0;
  limit = 10;
  page = 0;
  isLoading = false;
  searchForm: FormGroup;
  nameSearch = new FormControl();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // DATA = [
  //   { id: 1, name: 'Hydrogen', password: '********', email: 'correo@domain.com', uploaded_at: '4.0026' },
  //   { id: 2, name: 'Helium', password: '********', email: 'correo@domain.com', uploaded_at: '4.0026' },
  //   { id: 3, name: 'Lithium', password: '********', email: 'correo@domain.com', uploaded_at: '4.0026' },
  //   { id: 4, name: 'Beryllium', password: '********', email: 'correo@domain.com', uploaded_at: '4.0026' },
  //   { id: 5, name: 'Boron', password: '********', email: 'correo@domain.com', uploaded_at: '4.0026' },
  //   { id: 6, name: 'Carbon', password: '********', email: 'correo@domain.com', uploaded_at: '4.0026' },
  //   { id: 7, name: 'Nitrogen', password: '********', email: 'correo@domain.com', uploaded_at: '4.0026' },
  //   { id: 8, name: 'Oxygen', password: '********', email: 'correo@domain.com', uploaded_at: '4.0026' },
  //   { id: 9, name: 'Fluorine', password: '********', email: 'correo@domain.com', uploaded_at: '4.0026' },
  //   { id: 10, name: 'Neon', password: '********', email: 'correo@domain.com', uploaded_at: '4.0026' },
  // ];
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    'name',
    // 'password',
    'email',
    'created',
    'actions'];
  constructor(
    private restApi: ConnectServer,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notificationservice: NotificationService) {
    this.searchForm = this.formBuilder.group({
      nameSearch: this.nameSearch
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.restApi.getUsers().subscribe((res) => {
      // this.temp = data;
      this.isLoading = false;
      this.dataSource.data = res.docs;
      this.total = res.total;
      this.limit = res.limit;
      this.page = res.page - 1;
    });
  }

  getDateFormat(date: string) {
    const dateRaw = moment(date);
    return dateRaw.format('DD-MM-YYYY');
  }

  pager(event?: PageEvent) {
    if (event) {
      this.page = event.pageIndex + 1;
      this.total = event.pageSize;
    } else {
      this.page = 1;
      this.total = this.paginator.pageSize;
    }
    console.log('pager', this.page);
    this.restApi.getUsersFilter(this.paginator).subscribe(res => {
      console.log('filter', res);
      // this.temp.data = this.dataSource.data;
      this.total = res.total;
      this.limit = res.limit;
      this.page = res.page - 1;
      this.dataSource.data = res.docs;
    });
  }

  customSort(event: { active: string, direction: string }) {

  }

  onEdit(element) {
    console.log('element', element);
    const id = element._id;
    this.router.navigate(['./new'], { queryParams: { id }, relativeTo: this.route });
  }

  onDelete(element) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Confirma',
        message: '¿Deseas eliminar este usuario?',
        btnOkText: 'Si',
        btnCancelText: 'No',
        withInput: false,
        placeholder: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result);
      if (result) {
        this.restApi.deleteUser(element._id).subscribe(res => {
          console.log('response', res);
          this.notificationservice.showSuccess('Correcto', 'se elimino correctamente');
          const index = this.dataSource.data.indexOf(element);
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription(); // <-- Refresh the datasource
        });
      }
    });
  }
}
