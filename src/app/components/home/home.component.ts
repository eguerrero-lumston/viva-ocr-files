import { SessionService } from './../../services/session.service';
import { AdalService } from 'adal-angular4';
import { DialogConfirmComponent } from './../../single-components/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import isElectron from 'is-electron';
import { LocalStorageService } from 'src/app/util/local-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isElectron: boolean;
  rol = 0;
  constructor(
    private router: Router,
    private adalService: AdalService,
    private localStorageService: LocalStorageService,
    private sessionService: SessionService,
    public dialog: MatDialog) {
      this.isElectron = isElectron();
      this.rol = this.localStorageService.getRol();
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
        this.sessionService.logOut();
      }
    });
  }
}
