import { DialogConfirmComponent } from './../dialog-confirm/dialog-confirm.component';
import { NotificationService } from './../../api/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Manifest } from 'src/app/model/manifest/manifest';
import { ConnectServer } from './../../api/connect-server';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit {
  rows: Manifest[];

  columns = [
    { name: 'Nombre', prop: 'name' },
    { name: 'Cargado el', prop: 'uploaded_at' },
    { name: 'Estatus', prop: 'checkStatus' },
    { name: 'Acciones' },
  ];

  @ViewChild('dataManifestTable', {static: false}) table: DatatableComponent;

  constructor(private restApi: ConnectServer,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              private notificationservice: NotificationService) {
    // this.table.offset = 0;
    moment.locale('es');
   }

  ngOnInit() {
    this.restApi.getManifests().subscribe((data) => {
      console.log('data', data);
      this.rows = data;
    });
  }

  getDateFormat(date: string) {
    const dateRaw = moment(date);
    return dateRaw.format('DD-MM-YYYY');
  }

  onDelete(row: Manifest) {
    console.log(row);
    this.dialog.open(DialogConfirmComponent, {
      height: '400px',
      width: '600px',
      data: {
        title : 'Deseas eliminar',
        message : 'asdsadfsdf',
        btnOkText : 'si',
        btnCancelText: 'no'
      }
    });
    // this.restApi.deleteManifest(row.jobId).subscribe(res => {

    // });
  }

  onEdit(manifest: Manifest) {
    // console.log(row);
    const jobId = manifest.jobId;
    this.router.navigate(['./form', { jobId }], { relativeTo: this.route });
  }
}
