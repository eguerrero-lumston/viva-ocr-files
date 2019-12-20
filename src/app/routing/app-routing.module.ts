import { NewUserComponent } from './../components/users/new-user/new-user.component';
import { UsersComponent } from './../components/users/users.component';
import { NoGeneratedDetailsComponent } from './../components/compliance-report/no-generated-details/no-generated-details.component';
import { PathResolveService } from './../services/path-resolve.service';
import { NotFoundComponent } from './../components/not-found/not-found.component';
import { AuthGuard } from '../services/auth.guard';
import { DatatableComponent } from '../components/datatable/datatable.component';
import { ComplianceReportComponent } from './../components/compliance-report/compliance-report.component';
import { HomeComponent } from './../components/home/home.component';
import { LoginUserComponent } from './../components/login/login-user.component';
import { ManifestViewerComponent } from '../components/manifest-viewer/manifest-viewer.component';
import { ManifestFlightComponent } from '../components/manifest-flight/manifest-flight.component';
import { FormComponent } from '../components/form/form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';


const routes: Routes = [
  { path: 'login', component: LoginUserComponent, outlet: 'primary' },
  {
    path: '', component: HomeComponent, outlet: 'primary',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'upload'
      },
      {
        path: 'repository',
        children: [
          { path: '', component: ManifestFlightComponent },
          { path: 'form', component: FormComponent },
          { path: 'manifest-viewer', component: ManifestViewerComponent }
        ]
      },
      {
        path: 'manifest',
        children: [
          { path: '', component: DatatableComponent },
          { path: 'form', component: FormComponent },
          { path: 'manifest-viewer', component: ManifestViewerComponent }
        ]
      },
      {
        path: 'upload',
        children: [
          { path: '', component: FileUploadComponent }
        ]
      },
      {
        path: 'compliance-report',
        children: [
          { path: '', component: ComplianceReportComponent,
          children : [
            { path: 'details', component: NoGeneratedDetailsComponent }
          ]
        }
        ]
      },
      {
        path: 'users',
        children: [
          { path: '', component: UsersComponent },
          { path: 'new', component: NewUserComponent }
        ]
      }
    ]
  },
  {
    path: '**',
    resolve: {
      path: PathResolveService
    },
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
