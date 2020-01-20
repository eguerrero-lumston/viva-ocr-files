import { DocType } from './../../model/doc-type';
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
export class FormComponent implements OnInit {
  airportName = new FormControl();
  // fileForm2: FormGroup;
  dateOptions: string[];
  acronyms: string[];
  licences: string[];
  surcharges: string[];
  file = new File();
  docTypes: DocType[];
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
    // this.file.matches = new MatchesFile();
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.file.jobId = params.jobId;
        // console.log('params.isConfirmed', params.isConfirmed);
        this.isConfirmed = params.isConfirmed === 'true';
        this.api.getFile(this.file.jobId).subscribe(data => {
          // console.log('data ---->', data);
          this.file = data.doc;
          if (data.doc.course) {
            this.file.courseId = data.doc.course._id;
          }
          this.docTypes = data.typeDoc;
        });
      });
  }

  update() {
    // this.formattedFile();
    // console.log(this.file, this.isFormValid());
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
        this.file.checkStatus = 3;
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

  isFormValid() {
    return this.file.name !== '' &&
      this.file.fatherLastname !== '' &&
      this.file.motherLastname !== '' &&
      (this.file.courseId !== '' && this.file.courseId !== null && this.file.courseId !== undefined);
  }

}
