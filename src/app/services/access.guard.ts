import { SessionService } from './session.service';
import { ConnectServer } from './../api/connect-server';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad,
  Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../util/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private sessionService: SessionService) { }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const rol: number = this.localStorageService.getRol();
    // console.log('next', next);
    // console.log('state', state);
    if (rol === -1) {
      this.sessionService.logOut();
      return false;
    }

    return true;
  }

  returnToAnotherOne() {
    this.router.navigate(['/'], { queryParams: {} });
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const rol: number = this.localStorageService.getRol();
    // console.log('next', next);
    // console.log('state', state);
    const isContinue = rol === 1;
    if (!isContinue) {
      this.returnToAnotherOne();
    }
    return isContinue;
  }
}
