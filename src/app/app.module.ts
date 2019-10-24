import { FormComponent } from './components/form/form.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule, MatCheckboxModule } from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { AppComponent } from './components/app-root/app.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DragDropDirective } from './directives/drag-drop.directive';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatatableComponent } from './single-components/datatable/datatable.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    FileUploadComponent,
    DragDropDirective,
    DatatableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatGridListModule,
    NgxDatatableModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
