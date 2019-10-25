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
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    ManifestFlightComponent,
    FileUploadComponent,
    DragDropDirective,
    ManifestViewerComponent,
    DatatableComponent
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
    NgxMaterialTimepickerModule, //.setLocale('es_MX')
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);