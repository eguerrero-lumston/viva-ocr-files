import { Observable } from 'rxjs';
import { LocalStorageService } from './../../util/local-storage.service';
import { DialogConfirmComponent } from './../../single-components/dialog-confirm/dialog-confirm.component';
import { NotificationService } from './../../api/notification.service';
import { ConnectServer } from './../../api/connect-server';
import { ManifestViewerComponent } from './../manifest-viewer/manifest-viewer.component';
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Manifest } from 'src/app/model/manifest/manifest';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material/bottom-sheet';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { MatchesManifest } from 'src/app/model/manifest/matches-manifest';
import { ManifestObject } from 'src/app/model/manifest/manifest-object';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  airportName = new FormControl();
  // manifestForm2: FormGroup;
  dateOptions: string[];
  acronyms: string[];
  licences: string[];
  surcharges: string[];
  manifest = new Manifest();
  isOrigin = true;
  // manifestForm: FormGroup;
  name: string;
  isConfirmed = false;
  SERVER_FORMAT = 'DD/MM/YYYY';
  INPUT_FORMAT = 'YYYY-MM-DD';
  isPdfHidden = true;
  key = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private location: Location,
    private api: ConnectServer,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService) {
    this.manifest.matches = new MatchesManifest();
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.manifest.jobId = params.jobId;
        // console.log('params.isConfirmed', params.isConfirmed);
        this.isConfirmed = params.isConfirmed === 'true';
        this.api.getManifest(this.manifest.jobId).subscribe(data => {
          // console.log('data ---->', data);
          this.manifest = data;
          const dateF = moment(this.manifest.formatted_date, this.SERVER_FORMAT)
            .format(this.INPUT_FORMAT);
          if (moment(this.manifest.formatted_date, this.SERVER_FORMAT).isValid()) {
            this.manifest.formattedDate = dateF;
          }
          this.manifest.matches.acronyms = this.union(this.manifest.acronyms.filter(word => word !== ''), this.manifest.matches.acronyms);
          // this.acronyms = data.acronyms.filter(word => word !== '');
          this.licences = data.licences.filter(word => word !== '');
          this.surcharges = data.surcharges.filter(word => word !== '');
          // console.log('manifest ---->', this.manifest);
          if (this.localStorageService.exist(this.manifest.jobId)) {
            this.manifest = this.localStorageService.get(this.manifest.jobId) as Manifest;
          }
          this.onChange(this.manifest.origin.acronym, true);
        });
      });
    // Observable.of(this.manifest)
    this.airportName.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  onChange(value: string, isOrigin: boolean) {
    if (isOrigin) {
      this.isOrigin = this.manifest.airport.acronym === value;
    } else {
      this.isOrigin = value === this.manifest.origin.acronym;
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.manifest.matches.names.filter(option => option.toLowerCase().includes(filterValue));
  }

  union(...iterables: string[][]) {
    const set = new Set<string>();

    for (const iterable of iterables) {
      for (const item of iterable) {
        set.add(item);
      }
    }

    return Array.from(set);
  }
  update() {
    this.formattedManifest();
    // console.log(this.manifest);
    if (this.isFormValid()) {
      // console.log('it is submit');
      this.api.updateManifest(this.manifest).subscribe(res => {
        // console.log('response server--->', res);
        if (res) {
          this.localStorageService.delete(this.manifest.jobId);
          this.localStorageService.delete(this.manifest.key);
          this.notificationService.showSuccess('Correcto!', 'Se actualizó correctamente');
        }
      });
    } else {
      this.notificationService.showWarning('Advertencia', 'Compruebe todos los campos');
    }
  }

  async loadManifest() {
    // this.manifestForm.setValue(this.manifest);
    // console.log(this.manifest);
    if (!this.isFormValid()) {
      this.notificationService.showWarning('Precaución', 'Antes de confirmar debes llenar los datos necesarios');
      return;
    }
    await this.api.updateManifest(this.manifest).toPromise();
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Confirmar',
        message: `¿Deseas confirmar el manifiesto ${this.manifest.name}?,\n
         al finalizar regresaras a la pantalla anterior`,
        btnOkText: 'Si, confirmar',
        btnCancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.api.confirmManifest(this.manifest.jobId).subscribe(res => {
          if (res) {
            this.localStorageService.delete(this.manifest.jobId);
            this.localStorageService.delete(this.manifest.key);
            this.isConfirmed = true;
            this.notificationService.showSuccess('Correcto!', 'Se ha confirmado correctamente');
            this.location.back();
          }
        });
      }
    });
  }

  viewManifest() {
    // this.bottomSheet.open(ManifestViewerComponent, {
    //   data: { key: this.manifest.key },
    // });
    this.key = this.manifest.key;
    this.isPdfHidden = false;
  }

  public onCancel = () => {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Confirma',
        message: '¿Deseas regresar a la pagina anterior?',
        btnOkText: 'Si',
        btnCancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.location.back();
      }
    });
  }

  public hasError = (value: any) => {
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
      this.manifest.formattedDate !== '' &&
      moment(this.manifest.formattedDate, this.INPUT_FORMAT).isValid() &&
      this.manifest.airport.acronym !== '' &&
      this.manifest.company.acronym !== '' &&
      this.manifest.registration !== '' &&
      this.manifest.flightNumber !== null &&
      this.manifest.origin.name !== '' &&
      this.manifest.destination.name !== '' &&
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

  formatDate(date: string) {
    const dateRaw = moment(date, this.SERVER_FORMAT);
    const formatDate = dateRaw.format(this.INPUT_FORMAT);
    // console.log('formatDate---->', formatDate);
    return formatDate;
  }

  ngOnDestroy(): void {
    this.localStorageService.save(this.manifest.jobId, this.manifest);
  }

  onSubmit(form) {
    console.log(form);
    // form.preveny
  }

}
