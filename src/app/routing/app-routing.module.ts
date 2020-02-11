import { NewDocTypeComponent } from './../components/doc-type/new-doc-type/new-doc-type.component';
import { DocTypeComponent } from './../components/doc-type/doc-type.component';
import { NewUserComponent } from './../components/users/new-user/new-user.component';
import { UsersComponent } from './../components/users/users.component';
import { PathResolveService } from './../services/path-resolve.service';
import { NotFoundComponent } from './../components/not-found/not-found.component';
import { AuthGuard } from '../services/auth.guard';
import { DatatableComponent } from '../components/datatable/datatable.component';
import { HomeComponent } from './../components/home/home.component';
import { LoginUserComponent } from './../components/login/login-user.component';
import { FileViewerComponent } from '../components/file-viewer/file-viewer.component';
import { FormComponent } from '../components/form/form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';
import { AccessGuard } from '../services/access.guard';


const routes: Routes = [
  { path: 'login', component: LoginUserComponent, outlet: 'primary' },
  {
    path: '', component: HomeComponent, outlet: 'primary',
    canActivate: [AuthGuard],
    canActivateChild: [AccessGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'upload'
      },
      {
        path: 'file',
        children: [
          { path: '', component: DatatableComponent },
          { path: 'form', component: FormComponent },
          { path: 'file-viewer', component: FileViewerComponent }
        ]
      },
      {
        path: 'upload',
        children: [
          { path: '', component: FileUploadComponent }
        ]
      },
      {
        path: 'doc-types',
        children: [
          { path: '', component: DocTypeComponent },
          { path: 'new', component: NewDocTypeComponent }
        ]
      },
      {
        path: 'users',
        canActivate: [AccessGuard],
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
