import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Manifest } from 'src/app/model/manifest';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  // manifestForm2: FormGroup;
  manifest = new Manifest();
  manifestForm: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router) {
  }

  ngOnInit() {
    // this.manifestForm = this.fb.group({
    //   fieldFolio: [this.manifest.folio, Validators.required],
    //   fieldAirport: [this.manifest.airport, Validators.required],
    //   fieldCompany: [this.manifest.company, Validators.required],
    //   fieldDate: [this.manifest.date, Validators.required],
    //   fieldAirportAcronym: [this.manifest.airportacronym, Validators.required],
    //   fieldCompanyAcronym: [this.manifest.companyacronym, Validators.required],
    //   fieldEquipment: [this.manifest.equipment, Validators.required],
    //   fieldEnrollment: [this.manifest.enrollment, Validators.required],
    //   fieldFlightNumber: [this.manifest.flightnumber, Validators.required],
    //   fieldCommander: [this.manifest.commander, Validators.required],
    //   fieldFirstOfficer: [this.manifest.firstofficer, Validators.required],
    //   fieldSecondOfficer: [this.manifest.secondofficer, Validators.required],
    //   fieldThirdOfficer: [this.manifest.thirdofficer, Validators.required],
    //   fieldMajor: [this.manifest.major, Validators.required],
    //   fieldFirstSurcharge: [this.manifest.firstsurcharge, Validators.required],
    //   fieldSecondSurcharge: [this.manifest.secondsurcharge, Validators.required],
    //   fieldThirdSurcharge: [this.manifest.thirdsurcharge, Validators.required],
    //   fieldCommanderLicense: [this.manifest.commanderlicense, Validators.required],
    //   fieldFirstOfficerLicense: [this.manifest.firstofficerlicense, Validators.required],
    //   fieldSecondOfficerLicense: [this.manifest.secondofficerlicense, Validators.required],
    //   fieldThirdOfficerLicense: [this.manifest.thirdofficerlicense, Validators.required],
    //   fieldMajorLicense: [this.manifest.majorlicense, Validators.required],
    //   fieldFirstSurchargeLicense: [this.manifest.firstsurchargelicense, Validators.required],
    //   fieldSecondSurchargeLicense: [this.manifest.secondsurchargelicense, Validators.required],
    //   fieldThirdSurchargeLicense: [this.manifest.thirdsurchargelicense, Validators.required],
    //   fieldOrigin: [this.manifest.origin, Validators.required],
    //   fieldDestination: [this.manifest.destination, Validators.required],
    //   fieldNextScale: [this.manifest.nextscale, Validators.required],
    //   fieldItineraryTime: [this.manifest.itinerarytime, Validators.required],
    //   fieldDelayCause: [this.manifest.delaycause, Validators.required],
    //   fieldOriginAcronym: [this.manifest.originacronym, Validators.required],
    //   fieldDestinationAcronym: [this.manifest.destinationacronym, Validators.required],
    //   fieldNextScaleAcronym: [this.manifest.nextscaleacronym, Validators.required],
    //   fieldRealTime: [this.manifest.realtime, Validators.required],
    // });

    this.manifestForm = this.fb.group(this.manifest);
    // formBuilder.group({
    //   personalData: formBuilder.group(new PersonalData()),
    //   requestType: '',
    //   text: ''
    // });
  }

  update() {

  }

  loadManifest() {
    console.log(this.manifest, this.manifestForm.value);

  }

  viewManifest() {
    this.router.navigate(['/upload/manifest-viewer']);
  }

}
