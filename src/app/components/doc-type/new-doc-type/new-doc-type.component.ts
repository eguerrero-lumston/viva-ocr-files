import { Position } from './../../../model/position';
import { DocType } from './../../../model/doc-type';
import { DialogConfirmComponent } from './../../../single-components/dialog-confirm/dialog-confirm.component';
import { LocalStorageService } from './../../../util/local-storage.service';
import { NotificationService } from './../../../api/notification.service';
import { ConnectServer } from './../../../api/connect-server';
import { Observable } from 'rxjs';
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material/bottom-sheet';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { startWith, map } from 'rxjs/operators';
@Component({
  selector: 'app-new-doc-type',
  templateUrl: './new-doc-type.component.html',
  styleUrls: ['./new-doc-type.component.css']
})
export class NewDocTypeComponent implements OnInit {
  dateOptions: string[];
  acronyms: string[];
  licences: string[];
  positions: Position[] = [];
  isUpdate = false;
  surcharges: string[];
  docType = new DocType();
  docTypeForm: FormGroup;
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
    this.docTypeForm = this.fb.group({
      name: [null, Validators.required],
      positionId: [null, Validators.required],
      textToRecognize: [null, Validators.required ]
    });
  }

  ngOnInit() {
    this.api.getAllPositions().subscribe(res => {
      this.positions = res;
      this.docTypeForm.patchValue( { positionId: res[0]._id });
    });
    this.route.params
      .subscribe((params: Params) => {
        if (params.id) {
          this.api.getDocType(params.id).subscribe(res => {
            // this.userForm.value = res.data;
            if (!res) { return; }
            this.docType = res;
            this.isUpdate = true;
            this.docTypeForm.patchValue( this.docType);
            // this.docTypeForm.patchValue( { positionId: this.docType.position._id });
          });
        }
      });
  }

  onSubmit() {
    console.log(this.docType);
    if (this.docTypeForm.valid) {
      const docType = new DocType(this.docTypeForm.value);
      docType.positionId = this.docTypeForm.value.positionId;
      if (this.isUpdate) {
        docType._id = this.docType._id;
        this.api.updateDocType(docType).subscribe(res => {
          console.log('response', res);
          this.notificationService.showSuccess('Correcto', 'Se ha actualizado correctamente');
        });
      } else {
        this.api.newDocType(docType).subscribe(res => {
          console.log('response', res);
          this.notificationService.showSuccess('Correcto', 'Se ha agregado correctamente');
          this.docTypeForm.reset();
        });
      }
    } else {
      this.notificationService.showWarning('Compruebe', 'Compruebe todos los campos');
    }
    // form.preveny
  }

  public onCancel = () => {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Confirma',
        message: '¿Deseas regresar a la página anterior?',
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
}
