import { NotificationService } from './notification.service';
import { Pdf } from './../model/pdf';
import { FoldersRequest } from './../model/folders-request';
import { Folder } from './../model/folder';
import { Manifest } from 'src/app/model/manifest/manifest';
import { HelperService } from './helper.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ConnectServer {
    // Define API
    apiURL = environment.URL_HOST;
    constructor(private http: HttpClient,
                private notificationService: NotificationService,
                private toastr: ToastrService,
                private helperService: HelperService) {
    }

    /*========================================
      CRUD Methods for consuming RESTful API
    =========================================*/

    // Http Options
    headers = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    // HttpClient API get() method => Fetch manifest list
    getManifests(): Observable<Manifest[]> {
        this.helperService.startLoader();
        return this.http.get<Manifest[]>(this.apiURL + 'docs/', this.headers)
            .pipe(
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API get() method => Fetch one manifest
    getManifest(jobId: string): Observable<Manifest> {
        this.helperService.startLoader();
        const params = new HttpParams()
            .set('jobId', jobId);
        return this.http.get<Manifest>(this.apiURL + 'docs', { headers: this.headers.headers, params })
            .pipe(
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API put() method => update one manifest
    updateManifest(manifest: Manifest) {
        this.helperService.startLoader();
        return this.http.put<Manifest>(this.apiURL + 'docs', JSON.stringify(manifest), this.headers)
            .pipe(
                tap(data => this.helperService.stopLoader()),
                retry(1),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API delete() method => delete one manifest
    deleteManifest(id: string) {
        this.helperService.startLoader();
        return this.http.delete<Manifest>(this.apiURL + 'docs/' + id, this.headers)
            .pipe(
                tap(data => this.helperService.stopLoader()),
                retry(1),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API post() method => confirm one manifest
    confirmManifest(id: string) {
        this.helperService.startLoader();
        const params = {
            jobId: id
        };
        return this.http.post<Manifest>(this.apiURL + 'docs/confirm', params, this.headers)
            .pipe(
                tap(data => this.helperService.stopLoader()),
                retry(1),
                catchError(error => this.handleError(error))
            );
    }

    getFolders(): Observable<FoldersRequest> {
        this.helperService.startLoader();
        return this.http.get<FoldersRequest>(this.apiURL + 'folders/', this.headers)
            .pipe(
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    getPDFUri(name: string, loaderId: string): Observable<Pdf> {
        // this.helperService.startLoader(loaderId);
        const params = new HttpParams()
            .set('key', name);
        return this.http.get<Pdf>(this.apiURL + 'docs/pdf', { headers: this.headers.headers, params })
            .pipe(
                catchError(error => this.handleError(error))
            );
    }

    // Error handling
    handleError(error) {
        let errorMessage = '';
        console.log(error);
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        this.helperService.stopLoader();
        // console.log(errorMessage);
        // this.toastr.error("title", errorMessage);
        this.notificationService.showError('Error', errorMessage);
        // window.alert(errorMessage);
        return throwError(errorMessage);
    }

}
