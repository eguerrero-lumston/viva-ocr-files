import { ComplianceReportComponent } from './components/compliance-report/compliance-report.component';
import { HomeComponent } from './components/home/home.component';
import { LoginUserComponent } from './components/login/login-user.component';
import { GlobalVariable } from './global/global';
import { DelayInputDirective } from './directives/delay-input.directive';
import { QueueInterceptorService } from './api/queue-interceptor.service';
import { DialogConfirmComponent } from './single-components/dialog-confirm/dialog-confirm.component';
import { ToastNotificationComponent } from './single-components/toast-notification/toast-notification.component';
import { UppercaseDirective } from './directives/uppercase.directive';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MaterialModule } from './modules/material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './single-components/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FormComponent } from './components/form/form.component';
import { ManifestViewerComponent } from './components/manifest-viewer/manifest-viewer.component';
import { ManifestFlightComponent } from './components/manifest-flight/manifest-flight.component';
import { AppComponent } from './components/app-root/app.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DragDropDirective } from './directives/drag-drop.directive';
import { DatatableComponent } from './single-components/datatable/datatable.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    ManifestFlightComponent,
    FileUploadComponent,
    DragDropDirective,
    UppercaseDirective,
    DelayInputDirective,
    ManifestViewerComponent,
    DatatableComponent,
    ToastNotificationComponent,
    DialogConfirmComponent,
    LoginUserComponent,
    HomeComponent,
    ComplianceReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxDatatableModule,
    NgSelectModule,
    FormsModule,
    PdfViewerModule,
    HttpClientModule,
    NgxMaterialTimepickerModule, // .setLocale('es_MX')
    ReactiveFormsModule,
    MaterialModule,
    MatBottomSheetModule,
    NgxUiLoaderModule,
    ToastrModule.forRoot({
      // toastComponent: ToastNotificationComponent
    })
  ],
  entryComponents: [
    FormComponent, // THE MAGIC HAPPENDS HERE
    ManifestViewerComponent,
    ToastNotificationComponent,
    DialogConfirmComponent
  ],
  exports: [
    UppercaseDirective,
    DelayInputDirective,
  ],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: QueueInterceptorService,
    //   multi: true
    // },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    FormComponent,
    GlobalVariable
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
