import { LocalStorageService } from './../util/local-storage.service';
import { ReportsResponse } from './../model/request/reports-response';
import { ManifestPaginatorResponse } from './../model/request/manifest-paginator-response';
import { FileFilter } from './../model/file-filter';
import { Suggestions } from './../model/suggestion';
import { File } from './../model/file';
import { NotificationService } from './notification.service';
import { Pdf } from './../model/pdf';
import { FoldersRequest } from '../model/request/folders-request';
import { Folder } from './../model/folder';
import { Manifest } from 'src/app/model/manifest/manifest';
import { HelperService } from './helper.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError, tap, publishReplay, refCount } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class ConnectServer {
    // Define API
    apiURL = environment.URL_HOST;
    constructor(
        private http: HttpClient,
        private notificationService: NotificationService,
        private localStorageService: LocalStorageService,
        private helperService: HelperService,
        private snackBar: MatSnackBar) {
    }

    /*========================================
      CRUD Methods for consuming RESTful API
    =========================================*/

    // Http Options
    headers = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.localStorageService.getItem('token')}`,
        })
    };

    // HttpClient API post() method => Get token app
    getToken(oid: string): Observable<any> {
        this.helperService.startLoader();
        const params = {
            tkn_az: oid
        };
        return this.http.post<any>(this.apiURL + 'auth', params)
            .pipe(
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API get() method => Fetch manifest list
    getManifests(): Observable<ManifestPaginatorResponse> {
        this.helperService.startLoader();
        return this.http.get<ManifestPaginatorResponse>(this.apiURL + 'docs/', this.headers)
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

    getManifestFilter(paginator: MatPaginator, name?: string, status?: string): Observable<ManifestPaginatorResponse> {
        // this.helperService.startLoader();
        let params = new HttpParams();
        const page = paginator.pageIndex + 1;
        params = params.append('limit', String(paginator.pageSize));
        params = params.append('page', String(page));
        if (name) {
            params = params.append('name', name);
        }
        if (status) {
            params = params.append('checkStatus', status);
        }

        return this.http.get<ManifestPaginatorResponse>(this.apiURL + 'docs/filter/table', { headers: this.headers.headers, params })
            .pipe(
                // tap(data => this.helperService.stopLoader()),
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

    getFoldersFilter(filter: FileFilter): Observable<File[]> {
        this.helperService.startLoader();
        let params = new HttpParams();
        if (filter.date) {
            const SERVER_FORMAT = 'DD/MM/YYYY';
            const INPUT_FORMAT = 'YYYY-MM-DD';
            const dateRaw = moment(filter.date, INPUT_FORMAT);
            const formatDate = dateRaw.format(SERVER_FORMAT);
            console.log('formatDate---->', dateRaw, formatDate);
            params = params.append('date', formatDate);
        }
        if (filter.hour) {
            params = params.append('hour', filter.hour);
        }
        if (filter.acronym) {
            params = params.append('acronym', filter.acronym);
        }
        if (filter.registration) {
            params = params.append('registration', filter.registration);
        }
        if (filter.origin) {
            params = params.append('origin', filter.origin);
        }
        if (filter.destination) {
            params = params.append('destination', filter.destination);
        }

        return this.http.get<File[]>(this.apiURL + 'docs/filter', { headers: this.headers.headers, params })
            .pipe(
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    getFolder(name: string): Observable<FoldersRequest> {
        this.helperService.startLoader();
        return this.http.get<FoldersRequest>(this.apiURL + `folders${name}/`, { headers: this.headers.headers })
            .pipe(
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    getSuggestions(): Observable<Suggestions> {
        return this.http.get<Suggestions>(this.apiURL + 'docs/filter/suggestions', { headers: this.headers.headers })
            .pipe(
                catchError(error => this.handleError(error))
            );
    }

    getPDFUri(name: string, loaderId: string, isRepository: boolean): Observable<Pdf> {
        // this.helperService.startLoader(loaderId);
        const bucket = isRepository ? '/clean' : '/tmp';
        console.log(isRepository, bucket);
        const params = new HttpParams()
            .set('key', name);
        return this.http.get<Pdf>(this.apiURL + 'docs/pdf' + bucket, { headers: this.headers.headers, params })
            .pipe(
                publishReplay(1),
                refCount(),
                catchError(error => this.handleError(error))
            );
    }

    getReports(type: string, start?: moment.Moment, end?: moment.Moment): Observable<ReportsResponse> {
        this.helperService.startLoader();
        let params = new HttpParams();
        params = params.append('type', type);
        const SERVER_FORMAT = 'YYYY-MM-DD';
        if (start) {
            const formatDate = start.format(SERVER_FORMAT);
            // console.log('formatDate start---->', formatDate);
            params = params.append('start', formatDate);
        }
        if (end) {
            const formatDate = end.format(SERVER_FORMAT);
            // console.log('formatDate end---->', formatDate);
            params = params.append('end', formatDate);
        }
        return this.http.get<ReportsResponse>(this.apiURL + 'reports', { headers: this.headers.headers, params })
            .pipe(
                tap(data => this.helperService.stopLoader()),
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
        // this.toastr.error('title', errorMessage);
        this.notificationService.showError('Error', errorMessage);
        // const snackBarRef = this.snackBar.open(errorMessage, 'reintentar', {
        //     duration: 9000,
        //   });
        // snackBarRef.afterDismissed().subscribe(() => {
        //     console.log('The snack-bar was dismissed');
        // });
        // window.alert(errorMessage);
        return throwError(errorMessage);
    }

}
