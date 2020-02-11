import { LocalStorageService } from 'src/app/util/local-storage.service';
import { SessionService } from './session.service';
import { AdalService } from 'adal-angular4';
import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, CanLoad,
  Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private adal: AdalService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sessionService: SessionService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const rol: number = this.localStorageService.getRol();
    // console.log('canActivate', this.adal.userInfo.authenticated);
    if (rol === -1) {
      this.sessionService.logOut();
      return false;
    }

    if (this.adal.userInfo.authenticated) {
      return true;
    }
    // this.adal.login();
    this.router.navigate(['/login']);
    return false;
  }
}
