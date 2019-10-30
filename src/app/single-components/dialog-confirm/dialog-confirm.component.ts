import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
  btnOkText: string;
  btnCancelText: string;
}

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})
export class DialogConfirmComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogConfirmComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

     }

  ngOnInit() {
  }

  public decline() {
    this.dialogRef.close('Pizza!');
  }

  public accept() {
    // this.activeModal.close(true);
  }

  public dismiss() {7
    // this.activeModal.dismiss();
  }

}
