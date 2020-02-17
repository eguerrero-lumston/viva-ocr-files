import { NotificationService } from './../../../api/notification.service';
import { User } from 'src/app/model/user';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConnectServer } from './../../../api/connect-server';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DialogConfirmComponent } from 'src/app/single-components/dialog-confirm/dialog-confirm.component';
import { Location } from '@angular/common';
import { Role } from 'src/app/model/role';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  isUpdate = false;
  user = new User();
  roles: Role[] = [];
  userForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private api: ConnectServer,
    public dialog: MatDialog,
    private router: Router,
    private notificationService: NotificationService) {

    this.userForm = this.fb.group({
      name: [null, Validators.required],
      rolId: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.email])]
    });
  }

  ngOnInit() {
    console.log('roles');
    this.api.getRoles().subscribe(res => {
      this.roles = res;
    });
    this.route.queryParams
      .subscribe((params) => {
        console.log('paraa .---->', params);
        if (params.id) {
          this.api.getUser(params.id).subscribe(res => {
            // this.userForm.value = res.data;
            if (!res) { return; }
            this.user = res.user;
            this.isUpdate = true;
            this.roles = res.roles;
            this.userForm.patchValue(this.user);
            this.userForm.patchValue({ rolId: this.user.role._id});
          });
        }
      });
  }

  onSubmit() {
    console.log(this.userForm);
    if (this.userForm.valid) {
      const user = new User(this.userForm.value);
      if (this.isUpdate) {
        user._id = this.user._id;
        this.api.updateUser(user).subscribe(res => {
          console.log('response', res);
          this.notificationService.showSuccess('Correcto', 'Se ha actualizado correctamente');
        });
      } else {
        this.api.newUser(user).subscribe(res => {
          console.log('response', res);
          this.notificationService.showSuccess('Correcto', 'Se ha agregado correctamente');
          this.userForm.reset();
        });
      }
    }
    // form.preveny
  }

  onCancel() {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Confirma',
        message: '¿Deseas regresar a la página anterior?',
        btnOkText: 'Si',
        btnCancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/users']);
      }
    });
  }
}
