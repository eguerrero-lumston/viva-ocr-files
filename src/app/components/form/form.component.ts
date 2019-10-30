import { NotificationService } from './../../api/notification.service';
import { ConnectServer } from './../../api/connect-server';
import { ManifestViewerComponent } from './../manifest-viewer/manifest-viewer.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Manifest } from 'src/app/model/manifest/manifest';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material/bottom-sheet';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  // manifestForm2: FormGroup;
  dateOptions: string[];
  acronyms: string[];
  licences: string[];
  surcharges: string[];
  manifest = new Manifest();
  // manifestForm: FormGroup;
  name: string;
  SERVER_FORMAT = 'DD/MM/YYYY';
  INPUT_FORMAT = 'YYYY-MM-DD';

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private bottomSheet: MatBottomSheet,
              private location: Location,
              private api: ConnectServer,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.manifest.jobId = params.jobId;
        this.api.getManifest(this.manifest.jobId).subscribe(data => {
          console.log('data ---->', data);
          this.manifest = data;
          const dateF = moment(this.manifest.formatted_date, this.SERVER_FORMAT)
          .format(this.INPUT_FORMAT);
          this.manifest.formattedDate = dateF;
          // this.dateOptions = data.d
          this.acronyms = data.acronyms.filter(word => word !== '');
          this.licences = data.licences.filter(word => word !== '');
          this.surcharges = data.surcharges.filter(word => word !== '');
          // console.log('manifest ---->', this.manifest);
        });
      });
  }

  update() {
    this.formattedManifest();
    console.log(this.manifest);
    if (this.isFormValid()) {
      // console.log('it is submit');
      this.api.updateManifest(this.manifest).subscribe(res => {
        console.log('response server--->', res);
        this.notificationService.showSuccess('Correcto!', 'Se actualizò correctamente');
      });
    }
  }

  loadManifest() {
    // this.manifestForm.setValue(this.manifest);
    console.log(this.manifest);
    this.api.confirmManifest(this.manifest.jobId).subscribe(res => {
      this.notificationService.showSuccess('Correcto!', 'Se ha confirmado correctamente');
    });
  }

  viewManifest(event: MouseEvent) {
    this.bottomSheet.open(ManifestViewerComponent, {
      data: { pdfName: this.manifest.name },
    });
    // this.router.navigate(['/upload/manifest-viewer']);
  }

  public onCancel = () => {
    this.location.back();
  }

  public hasError = (value: string) => {
    return value === '' || value == null;
  }

  getHour(time: string) {
    // console.log(time);
    const dateRaw = moment(time);
    return dateRaw.format('HH:mm');
  }

  isFormValid() {
    return this.manifest.airport.name !== '' &&
    this.manifest.company.name !== '' &&
    this.manifest.formatted_date !== '' &&
    this.manifest.airport.acronym !== '' &&
    this.manifest.company.acronym !== '' &&
    this.manifest.registration !== '' &&
    this.manifest.flightNumber !== null &&
    this.manifest.origin.name !== '' &&
    this.manifest.destination.name !== '' &&
    this.manifest.nextScale.name !== '' &&
    this.manifest.intineraryHour !== '' &&
    this.manifest.origin.acronym !== '' &&
    this.manifest.destination.acronym;
  }

  formattedManifest() {
    if (this.manifest.formattedDate) {
        const dateRaw = moment(this.manifest.formattedDate, this.INPUT_FORMAT);
        const formatDate = dateRaw.format(this.SERVER_FORMAT);
        // console.log('formatDate---->', formatDate);
        this.manifest.formatted_date = formatDate;
     }
  }
}
