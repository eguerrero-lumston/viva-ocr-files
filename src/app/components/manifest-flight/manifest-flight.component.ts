import { Folder } from './../../model/folder';
import { ConnectServer } from './../../api/connect-server';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manifest-flight',
  templateUrl: './manifest-flight.component.html',
  styleUrls: ['./manifest-flight.component.scss']
})
export class ManifestFlightComponent implements OnInit {
  searchForm = new FormGroup({
    date: new FormControl(),
    hour: new FormControl(),
  });
  date = new FormControl(new Date());
  hour = new FormControl(new Date());
  selectedSupervisor = 'Todas';
  serializedDate = new FormControl((new Date()).toISOString());

  folders: string[] = ['ASD89', 'ASD89', 'ASD89'];
  files: string[]  = ['ASD89', 'ASD89', 'ASD89'];
  constructor(private router: Router,
              private route: ActivatedRoute,
              private restApi: ConnectServer) { }

  ngOnInit() {
    this.restApi.getFolders().subscribe((data) => {
      console.log('folders--->', data);
      this.folders = data.folders;
      this.files = data.files;
    });
  }

  viewDataManifest(name: string) {
    this.router.navigate(['./form', { name }], { relativeTo: this.route });
  }
}
