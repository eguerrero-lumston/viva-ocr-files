import { HomeComponent } from './../components/home/home.component';
import { LoginUserComponent } from './../components/login/login-user.component';
import { DatatableComponent } from './datatable/datatable.component';
import { ManifestViewerComponent } from '../components/manifest-viewer/manifest-viewer.component';
import { ManifestFlightComponent } from '../components/manifest-flight/manifest-flight.component';
import { FormComponent } from '../components/form/form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';


const routes: Routes = [
  { path: '', component: LoginUserComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'repository',
      children: [
        { path: '' , component: ManifestFlightComponent },
        { path: 'form', component: FormComponent },
        { path: 'manifest-viewer', component: ManifestViewerComponent }
      ],
      outlet: 'homeout'
  },
  {
    path: 'manifest',
      children: [
        { path: '' , component: DatatableComponent },
        { path: 'form', component: FormComponent },
        { path: 'manifest-viewer', component: ManifestViewerComponent }
      ],
      outlet: 'homeout'
  },
  {
    path: 'upload',
    children: [
      { path: '', component: FileUploadComponent, outlet: 'homeout' }
    ],
    outlet: 'homeout'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
