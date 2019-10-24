import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  // manifestForm2: FormGroup;

  manifestForm = new FormGroup({
    fieldFolio: new FormControl(''),
    fieldAeroport: new FormControl(''),
    fieldCompany: new FormControl(''),
    fieldDate: new FormControl(''),
    fieldAeroportAcronym: new FormControl(''),
    fieldCompanyAcronym: new FormControl(''),
    fieldEquipment: new FormControl(''),
    fieldEnrollment: new FormControl(''),
    fieldFlightNumber: new FormControl(''),
    fieldCommander: new FormControl(''),
    fieldFirstOfficer: new FormControl(''),
    fieldSecondOfficer: new FormControl(''),
    fieldThirdOfficer: new FormControl(''),
    fieldMajor: new FormControl(''),
    fieldFirstSurcharge: new FormControl(''),
    fieldSecondSurcharge: new FormControl(''),
    fieldThirdSurcharge: new FormControl(''),
    fieldCommanderLicense: new FormControl(''),
    fieldFirstOfficerLicense: new FormControl(''),
    fieldSecondOfficerLicense: new FormControl(''),
    fieldThirdOfficerLicense: new FormControl(''),
    fieldMajorLicense: new FormControl(''),
    fieldFirstSurchargeLicense: new FormControl(''),
    fieldSecondSurchargeLicense: new FormControl(''),
    fieldThirdSurchargeLicense: new FormControl(''),
    fieldOrigin: new FormControl(''),
    fieldDestination: new FormControl(''),
    fieldNextScale: new FormControl(''),
    fieldItineraryTime: new FormControl(''),
    fieldDelayCause: new FormControl(''),
    fieldOriginAcronym: new FormControl(''),
    fieldDestinationAcronym: new FormControl(''),
    fieldNextScaleAcronym: new FormControl(''),
    fieldRealTime: new FormControl(''),
  });
  constructor(public fb: FormBuilder) {
    this.manifestForm = this.fb.group({
      fieldFolio: ['', Validators.required],
      fieldAeroport: ['', Validators.required],
      fieldCompany: ['', Validators.required],
      fieldDate: ['', Validators.required],
      fieldAeroportAcronym: ['', Validators.required],
      fieldCompanyAcronym: ['', Validators.required],
      fieldEquipment: ['', Validators.required],
      fieldEnrollment: ['', Validators.required],
      fieldFlightNumber: ['', Validators.required],
      fieldCommander: ['', Validators.required],
      fieldFirstOfficer: ['', Validators.required],
      fieldSecondOfficer: ['', Validators.required],
      fieldThirdOfficer: ['', Validators.required],
      fieldMajor: ['', Validators.required],
      fieldFirstSurcharge: ['', Validators.required],
      fieldSecondSurcharge: ['', Validators.required],
      fieldThirdSurcharge: ['', Validators.required],
      fieldCommanderLicense: ['', Validators.required],
      fieldFirstOfficerLicense: ['', Validators.required],
      fieldSecondOfficerLicense: ['', Validators.required],
      fieldThirdOfficerLicense: ['', Validators.required],
      fieldMajorLicense: ['', Validators.required],
      fieldFirstSurchargeLicense: ['', Validators.required],
      fieldSecondSurchargeLicense: ['', Validators.required],
      fieldThirdSurchargeLicense: ['', Validators.required],
      fieldOrigin: ['', Validators.required],
      fieldDestination: ['', Validators.required],
      fieldNextScale: ['', Validators.required],
      fieldItineraryTime: ['', Validators.required],
      fieldDelayCause: ['', Validators.required],
      fieldOriginAcronym: ['', Validators.required],
      fieldDestinationAcronym: ['', Validators.required],
      fieldNextScaleAcronym: ['', Validators.required],
      fieldRealTime: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  update() {

  }

  loadManifest() {

  }

}
