import { DatatableComponent } from './datatable/datatable.component';
import { ManifestViewerComponent } from '../components/manifest-viewer/manifest-viewer.component';
import { ManifestFlightComponent } from '../components/manifest-flight/manifest-flight.component';
import { FormComponent } from '../components/form/form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';


const routes: Routes = [
  {
    path: 'repository',
      children: [
        { path: '' , component: ManifestFlightComponent },
        { path: 'form', component: FormComponent }
      ]
  },
  {
    path: 'manifest',
      children: [
        { path: '' , component: DatatableComponent },
        { path: 'form', component: FormComponent }
      ]
  },
  {
    path: 'upload',
    children: [
      { path: '', component: FileUploadComponent },
      { path: 'manifest-viewer', component: ManifestViewerComponent }
    ]
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
