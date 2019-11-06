import { HelperService } from './../../api/helper.service';
import { ConnectServer } from './../../api/connect-server';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, Inject, Optional, OnDestroy } from '@angular/core';
import { MatBottomSheetRef, MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import * as uuid from 'uuid';

@Component({
  selector: 'app-manifest-viewer',
  templateUrl: './manifest-viewer.component.html',
  styleUrls: ['./manifest-viewer.component.css']
})
export class ManifestViewerComponent implements OnInit, OnDestroy {

  loaderId = uuid.v4();
  isBottomSheet = false;
  pdfSrc = '';
  constructor(private router: Router,
              private route: ActivatedRoute,
              private bottomSheetRef: MatBottomSheet,
              private api: ConnectServer,
              private helperService: HelperService,
              @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    this.isBottomSheet = data != null;

  }

  ngOnInit() {
    this.helperService.startLoader(this.loaderId);
    // console.log(this.data);
    if (this.data) {
      this.getPdfFile(this.data.key);
    }
    this.route.params
      .subscribe((params: Params) => {
        // console.log(params);
        if (params.key) {
          this.getPdfFile(params.key);
        }
      });
  }

  getPdfFile(key: string) {
    this.api.getPDFUri(key, this.loaderId).subscribe(data => {
      this.pdfSrc = data.url;
    });
  }

  openInUrl() {
    this.bottomSheetRef.dismiss();
    this.router.navigate(['/manifest/manifest-viewer', { key: this.data.key }]);
  }

  close() {
    this.bottomSheetRef.dismiss();
  }

  afterLoadPdf() {
    // console.log('finish pdf');
    this.helperService.stopLoader(this.loaderId);
  }

  ngOnDestroy(): void {
    this.helperService.stopLoader(this.loaderId);
  }
}
