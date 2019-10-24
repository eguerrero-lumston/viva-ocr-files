import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit {
  rows = [
    { name: 'Manifiesto3333', date: '10/10/20', status: 1 },
    { name: 'Manifiesto3334', date: '10/10/20', status: 1 },
    { name: 'Manifiesto3335', date: '10/10/20', status: 1 },
    { name: 'Manifiesto3336', date: '10/10/20', status: 1 },
    { name: 'Manifiesto3337', date: '10/10/20', status: 1 },
    { name: 'Manifiesto3338', date: '10/10/20', status: 1 },
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
