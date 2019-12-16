import { AdalService } from 'adal-angular4';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad,
   Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private adal: AdalService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // console.log('canActivate', this.adal.userInfo.authenticated);
    if (this.adal.userInfo.authenticated) {
      return true;
    }
    // this.adal.login();
    this.router.navigate(['/login']);
    return false;
  }
}
