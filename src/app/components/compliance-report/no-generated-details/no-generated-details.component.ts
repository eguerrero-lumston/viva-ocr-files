import { ReportDetail } from './../../../model/report-detail';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-no-generated-details',
  templateUrl: './no-generated-details.component.html',
  styleUrls: ['./no-generated-details.component.css']
})
export class NoGeneratedDetailsComponent implements OnInit {

  @Input() details: ReportDetail[] = [];
  constructor() { }

  ngOnInit() {
  }

}
