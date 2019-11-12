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
  constructor(private adal: AdalService) {
    this.adal.init(environment.adalConfiguration);
  }
}
