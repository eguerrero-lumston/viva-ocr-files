import { NotificationService } from './../notification.service';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  url = environment.URL_HOST + 'docs/';
  constructor(private http: HttpClient,
              private notifierService: NotificationService) { }

  public upload(files: Set<File>): { [key: string]: { progress: Observable<number>, isFinish: Observable<boolean> } } {

    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number>, isFinish: Observable<boolean> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      // console.log('document', file, file.name);
      formData.append('document', file, file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', this.url, formData, {
        reportProgress: true,
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();
      const isFinish = new Subject<boolean>();
      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
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
