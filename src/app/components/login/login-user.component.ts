import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { AdalService } from 'adal-angular4';
import { HttpClient } from 'selenium-webdriver/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
  //   private adalService: AdalService
  ) {

  //   this.adalService.init(environment.adalConfiguration);
  //   this.adalService.handleWindowCallback();

  //   console.log("this.adalService.userInfo.authenticated",
  // this.adalService.userInfo.authenticated, this.adalService.userInfo.profile.oid);
  //   console.log("userinfo", this.adalService.userInfo);
  //   // if (this.adalService.userInfo.authenticated) {
  //   //         this.router.navigate(['/dashboard']);
  //   // }
  }

  ngOnInit() {
  }

  login() {
    this.router.navigate(['/']);
    // this.adalService.login();
  }

  ngAfterViewInit() {
  }
}
