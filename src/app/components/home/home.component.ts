import { AdalService } from 'adal-angular4';
import { DialogConfirmComponent } from './../../single-components/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import isElectron from 'is-electron';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isElectron: boolean;
  
  constructor(
    private router: Router,
    private adalService: AdalService,
    public dialog: MatDialog) {
      this.isElectron = isElectron();
    }

  ngOnInit() {

  }

  logout() {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Confirmar',
        message: '¿Deseas cerrar sesión?',
        btnOkText: 'Sí, cerrar',
        btnCancelText: 'No, permanecer'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        // logout
        // this.adalService.logOut();
        this.router.navigate(['/login']);
      }
    });
  }
}
