import { Observable } from 'rxjs';
import { LocalStorageService } from './../../util/local-storage.service';
import { DialogConfirmComponent } from './../../single-components/dialog-confirm/dialog-confirm.component';
import { NotificationService } from './../../api/notification.service';
import { ConnectServer } from './../../api/connect-server';
import { FileViewerComponent } from './../file-viewer/file-viewer.component';
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { File } from 'src/app/model/file/file';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material/bottom-sheet';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { MatchesFile } from 'src/app/model/file/matches-file';
import { FileObject } from 'src/app/model/file/file-object';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  airportName = new FormControl();
  // fileForm2: FormGroup;
  dateOptions: string[];
  acronyms: string[];
  licences: string[];
  surcharges: string[];
  file = new File();
  // fileForm: FormGroup;
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
    this.file.matches = new MatchesFile();
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.file.jobId = params.jobId;
        // console.log('params.isConfirmed', params.isConfirmed);
        this.isConfirmed = params.isConfirmed === 'true';
        this.api.getFile(this.file.jobId).subscribe(data => {
          // console.log('data ---->', data);
          this.file = data;
          const dateF = moment(this.file.formatted_date, this.SERVER_FORMAT)
            .format(this.INPUT_FORMAT);
          if (moment(this.file.formatted_date, this.SERVER_FORMAT).isValid()) {
            this.file.formattedDate = dateF;
          }

          // this.file.matches.acronyms = this.union(this.file.acronyms.filter(word => word !== ''), this.file.matches.acronyms);
          // this.acronyms = data.acronyms.filter(word => word !== '');
          // this.licences = data.licences.filter(word => word !== '');
          // this.surcharges = data.surcharges.filter(word => word !== '');
          // console.log('file ---->', this.file);
          // if (this.localStorageService.exist(this.file.jobId)) {
          //   this.file = this.localStorageService.get(this.file.jobId) as File;
          // }
          // this.onChange(this.file.origin.acronym, true);
        });
      });
    // Observable.of(this.file)
    this.airportName.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.file.matches.names.filter(option => option.toLowerCase().includes(filterValue));
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
    this.formattedFile();
    // console.log(this.file);
    if (this.isFormValid()) {
      // console.log('it is submit');
      this.api.updateFile(this.file).subscribe(res => {
        // console.log('response server--->', res);
        if (res) {
          this.localStorageService.delete(this.file.jobId);
          this.localStorageService.delete(this.file.key);
          this.notificationService.showSuccess('Correcto!', 'Se actualizó correctamente');
        }
      });
    } else {
      this.notificationService.showWarning('Advertencia', 'Compruebe todos los campos');
    }
  }

  async loadFile() {
    // this.fileForm.setValue(this.file);
    // console.log(this.file);
    if (!this.isFormValid()) {
      this.notificationService.showWarning('Precaución', 'Antes de confirmar debes llenar los datos necesarios');
      return;
    }
    await this.api.updateFile(this.file).toPromise();
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Confirmar',
        message: `¿Deseas confirmar el expediente ${this.file.name}?,\n
         al finalizar regresaras a la pantalla anterior`,
        btnOkText: 'Si, confirmar',
        btnCancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.api.confirmFile(this.file.jobId).subscribe(res => {
          if (res) {
            this.localStorageService.delete(this.file.jobId);
            this.localStorageService.delete(this.file.key);
            this.isConfirmed = true;
            this.notificationService.showSuccess('Correcto!', 'Se ha confirmado correctamente');
            this.location.back();
          }
        });
      }
    });
  }

  viewFile() {
    // this.bottomSheet.open(FileViewerComponent, {
    //   data: { key: this.file.key },
    // });
    this.key = this.file.key;
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
    return this.file.airport.name !== '' &&
      this.file.company.name !== '' &&
      this.file.formattedDate !== '' &&
      moment(this.file.formattedDate, this.INPUT_FORMAT).isValid() &&
      this.file.airport.acronym !== '' &&
      this.file.company.acronym !== '' &&
      this.file.registration !== '' &&
      this.file.flightNumber !== null &&
      this.file.origin.name !== '' &&
      this.file.destination.name !== '' &&
      this.file.intineraryHour !== '' &&
      this.file.origin.acronym !== '' &&
      this.file.destination.acronym;
  }

  formattedFile() {
    if (this.file.formattedDate) {
      const dateRaw = moment(this.file.formattedDate, this.INPUT_FORMAT);
      const formatDate = dateRaw.format(this.SERVER_FORMAT);
      // console.log('formatDate---->', formatDate);
      this.file.formatted_date = formatDate;
    }
  }

  formatDate(date: string) {
    const dateRaw = moment(date, this.SERVER_FORMAT);
    const formatDate = dateRaw.format(this.INPUT_FORMAT);
    // console.log('formatDate---->', formatDate);
    return formatDate;
  }

  ngOnDestroy(): void {
    this.localStorageService.save(this.file.jobId, this.file);
  }

  onSubmit(form) {
    console.log(form);
    // form.preveny
  }

}
