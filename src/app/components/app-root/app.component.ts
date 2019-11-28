import { PlatformLocation } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AdalService } from 'adal-angular4';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Viva';
  color = '#7EC636';
  constructor(
    private adal: AdalService,
    platformLocation: PlatformLocation) {
    environment.adalConfiguration.redirectUri = (platformLocation as any).location.origin + '/login';
    environment.adalConfiguration.postLogoutRedirectUri = (platformLocation as any).location.origin + '/login';
    this.adal.init(environment.adalConfiguration);
  }
}
