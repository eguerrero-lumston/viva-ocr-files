import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  rows = [
    { name: 'Manifiesto3333', date: '10/10/20', status: 1 },
    { name: 'Manifiesto3334', date: '10/10/20', status: 1 }
  ];

  columns = [
    { name: 'Nombre', prop: 'name' },
    { name: 'Cargado el', prop: 'date' },
    { name: 'Estatus', prop: 'status' },
    { name: 'Acciones' },
  ]

  constructor() { }

  ngOnInit() {
  }

}
