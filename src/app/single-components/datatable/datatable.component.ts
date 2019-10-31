import { Manifest } from './../../model/manifest/manifest';
import { DialogConfirmComponent } from './../dialog-confirm/dialog-confirm.component';
import { NotificationService } from './../../api/notification.service';
import { Router, ActivatedRoute, Event } from '@angular/router';
import { ConnectServer } from './../../api/connect-server';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit {
  rows: Manifest[];
  temp: Manifest[];
  manifestToSend = new Set<Manifest>();

  columns = [
    { name: 'Nombre', prop: 'name', sortable: true },
    { name: 'Cargado el', prop: 'uploaded_at', sortable: true },
    { name: 'Estatus', prop: 'checkStatus', sortable: true },
    { name: 'Acciones', prop: 'actions' },
  ];

  @ViewChild('dataManifestTable', { static: false }) table: DatatableComponent;

  constructor(private restApi: ConnectServer,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              private notificationservice: NotificationService) {
    moment.locale('es');
  }

  ngOnInit() {
    this.restApi.getManifests().subscribe((data) => {
      console.log('data', data);
      this.rows = data;
      this.temp = data;
    });
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
            const index = this.rows.indexOf(row);
            this.rows.splice(index, 1);
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
          if (manifest.checkStatus === 3) {
            this.restApi.confirmManifest(manifest.jobId).subscribe(res => {
              if (res) {
                this.notificationservice.showSuccess('Correcto!', `Se ha confirmado ${manifest.name} correctamente`);
                this.manifestToSend.add(manifest);
                const index = this.rows.indexOf(manifest);
                this.rows.splice(index, 1);
              }
            });
          }
        });
      }
    });

  }

  onSort(event: Event) {
    console.log(event);

  }

  onCheckIsPressed(manifest: Manifest, check: MatCheckbox) {
    // console.log(manifest, check.checked);
    if (manifest.checkStatus !== 3) {
      return;
    }
    if (check.checked) {
      this.manifestToSend.delete(manifest);
    } else {
      this.manifestToSend.add(manifest);
    }
    // console.log(this.manifestToSend);
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(value => {
      return value.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
}
