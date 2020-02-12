import { LocalStorageService } from './../../util/local-storage.service';
import { NotificationService } from './../notification.service';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  url = environment.URL_HOST + 'docs/';
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private notifierService: NotificationService) { }

  public upload(files: Set<File>, position: string, sheets: string):
  { [key: string]: { progress: Observable<number>, isFinish: Observable<boolean> } } {

    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number>, isFinish: Observable<boolean> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      // console.log('document', file, file.name);
      formData.append('document', file, file.name);
      formData.append('position', position);
      formData.append('sheets', sheets);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', this.url, formData, {
        reportProgress: true,
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.localStorageService.get('token')}`,
      })
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();
      const isFinish = new Subject<boolean>();
      // send the http-request and subscribe for progress-updates
      this.http.request(req).pipe(
        catchError(error => {
          progress.error(error);
          return throwError(error);
        })
      ).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {

          // calculate the progress percentage
          const percentDone = Math.round(event.loaded / event.total * 100);
          // pass the percentage into the progress-stream
          isFinish.next(percentDone === 100);
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          isFinish.next(true);
          isFinish.complete();
          progress.complete();
          this.notifierService.showSuccess('Correcto', `${file.name} se subio correctamente`);
        }
      }, error => {
        // console.log(error.message);
        this.notifierService.showError('Error', `${file.name} no se subio, ${error.message}`, true);
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable(),
        isFinish: isFinish.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }
}
