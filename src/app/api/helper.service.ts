import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  addContentTypeHeader: boolean;

  constructor(private ngxService: NgxUiLoaderService) { }

  startLoader(loaderName?: string) {
    if (loaderName) {
      this.ngxService.startLoader(loaderName);
    } else {
      this.ngxService.start();
    }
  }

  stopLoader(loaderName?: string) {
    if (loaderName) {
      this.ngxService.stopLoader(loaderName);
    } else {
      this.ngxService.stop();
    }
  }

}
