import { NotificationService } from './../../api/notification.service';
import { UploadService } from './../../api/upload/upload.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  @ViewChild('fileInput', { static: true }) fileInput;
  public files: Set<File> = new Set();
  isLoading = false;

  format = 'OMA';
  type = 'llegada';
  progress;
  canBeClosed = true;
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;
  constructor(
    public uploadService: UploadService,
    private notificationservice: NotificationService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'delete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/PDF_file_icon.svg')
    );
  }

  ngOnInit() {
    this.isLoading = false;
    this.fileInput.nativeElement.value = null;
    // this.fileInput.nativeElement.files.clean();
    this.files.clear();
    this.progress = null;
    this.canBeClosed = true;
    this.showCancelButton = true;
    this.uploading = false;
    // this.notificationservice.showSuccess("safdas", "dvfds");
    // this.notificationservice.showCustom();
  }

  uploadFile(event) {
    console.log('is from drop', event, this.fileInput.nativeElement.files);
    // event.array.forEach(element => {
    this.fileInput.nativeElement.files = event;
    // });
    this.addFiles(event);
  }
  onThumbnailSelected(event) {
    console.log('is from selected', event);
    this.addFiles(event);
  }

  addFiles(event: Event) {

    // console.log('uploadFile', event, this.fileInput);
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    // this.fileInput.nativeElement.value = null;
    // console.log('files', files);
    for (const key in files) {
      if (!isNaN(parseInt(key, NaN)) && this.isAcceptable(files[key].name)) {
        this.files.add(files[key]);
      }
    }
    // console.log('files ---', files);
    if (this.files.size > 0) {
      this.uploadFiles();
    } else {
      return;
    }
    this.isLoading = true;
    if (this.uploading) {
      this.notificationservice.showInfo('Información', 'Espera a que los archivos seleccionados sean subidos');
      return;
    } else {
      this.notificationservice.showInfo('Información', 'Iniciando subida de los archivos seleccionados');
    }
  }


  getExtension(filename: string) {
    const parts = filename.split('.');
    return parts[parts.length - 1];
  }

  isAcceptable(filename) {
    const ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'png':
      case 'pdf':
        //etc
        return true;
    }
    return false;
  }
  uploadFiles() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      // console.log('It is already to close');
      // return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    this.progress = this.uploadService.upload(this.files, this.format, this.type);
    // console.log(this.progress);
    // convert the progress map into an array
    const allProgressObservables = [];

    // tslint:disable-next-line: forin
    for (const key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
      // this.progress[key].progress.subscribe({
      //   next(num) { console.log(num); },
      //   complete() {
      //     console.log('Finished sequence progress');
      //   },
      //   error(error) {
      //     console.log('error', error);
      //   }
      // });
      // this.progress[key].isFinish.subscribe({
      //   next(isFinish) { console.log(isFinish); },
      //   complete() { console.log('Finished sequence isFinish'); }
      // });
    }

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    // this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      console.log('allProgressObservables are finished', end);
      this.fileInput.nativeElement.value = null;
      // ... the dialog can be closed again...
      this.canBeClosed = true;
      // this.dialogRef.disableClose = false;
      this.isLoading = false;
      // ... the upload was successful...
      this.uploadSuccessful = true;
      this.files.clear();
      // ... and the component is no longer uploading
      this.uploading = false;
    }, error => {
      this.fileInput.nativeElement.value = null;
      console.log('allProgressObservables are finished with error', error);
      this.canBeClosed = true;
      // this.dialogRef.disableClose = false;
      this.isLoading = false;
      // ... the upload was successful...
      this.uploadSuccessful = true;
      this.files.clear();
      // ... and the component is no longer uploading
      this.uploading = false;
    });
  }
}
