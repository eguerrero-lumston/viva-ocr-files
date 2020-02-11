import { LocalStorageService } from 'src/app/util/local-storage.service';
import { Router } from '@angular/router';
import { AdalService } from 'adal-angular4';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private adalService: AdalService) { }

  logIn(token, rol) {
    this.localStorageService.save('token', token);
    this.localStorageService.saveRol(rol);
    this.router.navigate(['/']);
  }

  logOut() {
    this.localStorageService.clear();
    this.adalService.logOut();
    this.router.navigate(['/login']);
  }
}
