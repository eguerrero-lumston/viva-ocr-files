import { NewUserComponent } from './components/users/new-user/new-user.component';
import { AuthGuard } from './services/auth.guard';
import { AdalService, AdalInterceptor } from 'adal-angular4';
import { AppRoutingModule } from './routing/app-routing.module';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

import { FormComponent } from './components/form/form.component';
import { FileViewerComponent } from './components/file-viewer/file-viewer.component';
import { AppComponent } from './components/app-root/app.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DragDropDirective } from './directives/drag-drop.directive';
import { DatatableComponent } from './components/datatable/datatable.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ToastrModule } from 'ngx-toastr';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UsersComponent } from './components/users/users.component';
import { DocTypeComponent } from './components/doc-type/doc-type.component';
import { NewDocTypeComponent } from './components/doc-type/new-doc-type/new-doc-type.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    FileUploadComponent,
    DragDropDirective,
    UppercaseDirective,
    DelayInputDirective,
    FileViewerComponent,
    DatatableComponent,
    ToastNotificationComponent,
    DialogConfirmComponent,
    LoginUserComponent,
    HomeComponent,
    NotFoundComponent,
    UsersComponent,
    NewUserComponent,
    DocTypeComponent,
    NewDocTypeComponent
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
    NgOptionHighlightModule,
    ToastrModule.forRoot({
      // toastComponent: ToastNotificationComponent
    })
  ],
  entryComponents: [
    FormComponent, // THE MAGIC HAPPENDS HERE
    FileViewerComponent,
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
    AdalService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AdalInterceptor, multi: true },
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
