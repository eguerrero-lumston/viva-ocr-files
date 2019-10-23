import { FormComponent } from './components/form/form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload.component';


const routes: Routes = [
  { path: 'form', component: FormComponent },
  { path: 'upload', component: FileUploadComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
