import { LocalStorageService } from './../../util/local-storage.service';
import { NotificationService } from './../../api/notification.service';
import { HelperService } from './../../api/helper.service';
import { ConnectServer } from './../../api/connect-server';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, Inject, Optional, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { MatBottomSheetRef, MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import * as uuid from 'uuid';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css']
})
export class FileViewerComponent implements OnInit {

  @Input() key = '';
  color = '#7EC636';
  rotation =  0;
  loaderId = uuid.v4();
  @Input() isBottomSheet = false;
  @Output() closeWindow = new EventEmitter();
  pdfSrc = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bottomSheetRef: MatBottomSheet,
    private api: ConnectServer,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private notificationService: NotificationService,
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    this.isBottomSheet = data != null;

  }

  ngOnInit() {
    this.helperService.startLoader(this.loaderId);
    // console.log(this.data);
    if (this.key) {
      this.getPdfFile(this.key, false);
    }
    this.route.params
      .subscribe((params: Params) => {
        // console.log('params', params);
        if (params.key) {
          this.getPdfFile(params.key, params.isRepository === 'true');
        }
      });
  }

  getPdfFile(key: string, isRepository: boolean) {
    // console.log('keeey', key, isRepository);
    // if (this.localStorageService.exist(key)) {
    //   this.pdfSrc = this.localStorageService.get(key);
    // } else {
      this.api.getPDFUri(key, this.loaderId, isRepository).subscribe(data => {
        this.localStorageService.save(key, data.url);
        this.pdfSrc = data.url;
      });
    // }
  }

  openInUrl() {
    this.bottomSheetRef.dismiss();
    this.router.navigate(['/file/file-viewer', { key: this.key, isRepository: false }]);
  }

  close() {
    this.closeWindow.emit(null);
    // this.bottomSheetRef.dismiss();
  }

  afterLoadPdf() {
    // console.log('finish pdf');
    this.helperService.stopLoader(this.loaderId);
  }

  onError(error: any) {
    // do anything
    this.closeWindow.emit(null);
    this.helperService.stopLoader(this.loaderId);
    this.notificationService.showError('Error', 'No se pudo cargar el archivo ' + error);
  }
}
