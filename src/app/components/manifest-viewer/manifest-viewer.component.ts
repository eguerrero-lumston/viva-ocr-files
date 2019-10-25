import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manifest-viewer',
  templateUrl: './manifest-viewer.component.html',
  styleUrls: ['./manifest-viewer.component.css']
})
export class ManifestViewerComponent implements OnInit {

  pdfSrc = '/assets/Manifiestos_Aeropuertos (1).pdf';
  constructor() { }

  ngOnInit() {
  }

}
