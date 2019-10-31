import { ToastNotificationComponent } from './../single-components/toast-notification/toast-notification.component';
import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly notifier: ToastrService;
  private readonly options: Partial<IndividualConfig> = {
    timeOut: 5000,
    progressBar: true,
    progressAnimation: 'increasing',
    positionClass: 'toast-bottom-left',
  };

  constructor(private toastr: ToastrService) {
    this.notifier = toastr;
  }

  showSuccess(title: string, body: string) {
    this.notifier.success(body, title, this.options);
  }

  showError(title: string, body: string) {
    this.notifier.error(body, title, this.options);
  }

  showInfo(title: string, body: string) {
    this.notifier.info(body, title, this.options);
  }

  showWarning(title: string, body: string) {
    this.notifier.warning(body, title, this.options);
  }

  showCustom() {
    this.notifier.success('title', 'title', this.options);
    // this.notifier.show()
    // this.toastr.show('Test",null,{
    //   disableTimeOut: true,
    //   tapToDismiss: false,
    //   toastClass: "toast border-red",
    //   closeButton: true,
    //   positionClass:'bottom-left'
    // });
  }
}
