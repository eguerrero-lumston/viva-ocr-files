import { DocTypeRequest } from './../model/request/doc-type-request';
import { DocType } from './../model/doc-type';
import { DocTypesRequest } from './../model/request/doc-types-request';
import { AdalService } from 'adal-angular4';
import { ServerError } from './server-error';
import { UsersRequest } from './../model/request/users-request';
import { User } from 'src/app/model/user';
import { ReportDetail } from './../model/report-detail';
import { LocalStorageService } from './../util/local-storage.service';
import { ReportsResponse } from './../model/request/reports-response';
import { FilePaginatorResponse } from './../model/request/file-paginator-response';
import { FileFilter } from './../model/file-filter';
import { Suggestions } from './../model/suggestion';
// import { File } from './../model/file';
import { NotificationService } from './notification.service';
import { Pdf } from './../model/pdf';
import { Folder } from './../model/folder';
import { File } from 'src/app/model/file/file';
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
import { Position } from '../model/position';

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
        private adalService: AdalService) {
    }

    /*========================================
      CRUD Methods for consuming RESTful API
    =========================================*/

    // Http Options
    headers() {
        const header = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.getStoredToken()}`,
            })
        };
        return header;
    }

    getStoredToken(): string {
        // console.log('token', this.localStorageService.get('token'));
        return this.localStorageService.exist('token') ? this.localStorageService.get('token') : '';
    }

    // HttpClient API post() method => Get token app
    getToken(oid: string, email?: string): Observable<any> {
        this.helperService.startLoader();
        const params = {
            tkn_az: oid,
            email
        };
        return this.http.post<any>(this.apiURL + 'auth', params)
            .pipe(
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API get() method => Fetch file list
    getFiles(): Observable<FilePaginatorResponse> {
        this.helperService.startLoader();
        return this.http.get<FilePaginatorResponse>(this.apiURL + 'docs/', this.headers())
            .pipe(
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API get() method => Fetch one file
    getFile(jobId: string): Observable<DocTypeRequest> {
        this.helperService.startLoader();
        const params = new HttpParams()
            .set('jobId', jobId);
        return this.http.get<DocTypeRequest>(this.apiURL + 'docs', { headers: this.headers().headers, params })
            .pipe(
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    getFileFilter(paginator: MatPaginator, name?: string, status?: string): Observable<FilePaginatorResponse> {
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

        return this.http.get<FilePaginatorResponse>(this.apiURL + 'docs/filter/table', { headers: this.headers().headers, params })
            .pipe(
                // tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API put() method => update one file
    updateFile(file: File) {
        this.helperService.startLoader();
        return this.http.put<File>(this.apiURL + 'docs', JSON.stringify(file), this.headers())
            .pipe(
                tap(data => this.helperService.stopLoader()),
                retry(1),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API delete() method => delete one file
    deleteFile(id: string) {
        this.helperService.startLoader();
        return this.http.delete<File>(this.apiURL + 'docs/' + id, this.headers())
            .pipe(
                tap(data => this.helperService.stopLoader()),
                retry(1),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API post() method => confirm one file
    confirmFile(id: string) {
        this.helperService.startLoader();
        const params = {
            jobId: id
        };
        return this.http.post<File>(this.apiURL + 'docs/confirm', params, this.headers())
            .pipe(
                tap(data => this.helperService.stopLoader()),
                retry(1),
                catchError(error => this.handleError(error))
            );
    }

    getPDFUri(name: string, loaderId: string, isRepository: boolean): Observable<Pdf> {
        // this.helperService.startLoader(loaderId);
        const bucket = isRepository ? '/clean' : '/tmp';
        // console.log(isRepository, bucket);
        const params = new HttpParams()
            .set('key', name);
        return this.http.get<Pdf>(this.apiURL + 'docs/pdf' + bucket, { headers: this.headers().headers, params })
            .pipe(
                publishReplay(1),
                refCount(),
                catchError(error => this.handleError(error))
            );
    }

    /*========================================
                    Users
    =========================================*/
    // HttpClient API get() method => Fetch users list
    getUsers(): Observable<UsersRequest> {
        this.helperService.startLoader();
        return this.http.get<UsersRequest>(this.apiURL + 'users', this.headers())
            .pipe(
                tap(data => this.print('getUsers', data)),
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API get() method => Fetch user
    getUser(id: string): Observable<User> {
        const params = new HttpParams()
            .set('id', id);
        return this.http.get<User>(this.apiURL + 'users', { headers: this.headers().headers, params })
            .pipe(
                tap(data => this.print('getUser', data)),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API post() method => update one user
    newUser(user: User) {
        this.helperService.startLoader();
        return this.http.post<User>(this.apiURL + 'users', user, this.headers())
            .pipe(
                tap(data => this.print('newUser', data)),
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API delete() method => update one user
    deleteUser(id: string) {
        this.helperService.startLoader();
        return this.http.delete<User>(this.apiURL + 'users/' + id,  this.headers())
            .pipe(
                tap(data => this.print('deleteUser', data)),
                tap(data => {
                    this.helperService.stopLoader();
                }),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API put() method => update one category
    updateUser(user: User) {
        this.helperService.startLoader();
        return this.http.put<User>(this.apiURL + 'users', user, this.headers())
            .pipe(
                tap(data => this.print('updateUser', data)),
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    getUsersFilter(paginator: MatPaginator, name?: string, status?: string): Observable<UsersRequest> {
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

        return this.http.get<UsersRequest>(this.apiURL + 'users/filter/table', { headers: this.headers().headers, params })
            .pipe(
                // tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    /*========================================
                    DocType
    =========================================*/
    // HttpClient API get() method => Fetch users list
    getDocTypes(): Observable<DocTypesRequest> {
        this.helperService.startLoader();
        return this.http.get<DocTypesRequest>(this.apiURL + 'docs-type', this.headers())
            .pipe(
                tap(data => this.print('getDocTypes', data)),
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API get() method => Fetch user
    getDocType(id: string): Observable<DocType> {
        this.helperService.startLoader();
        const params = new HttpParams()
            .set('id', id);
        return this.http.get<DocType>(this.apiURL + 'docs-type', { headers: this.headers().headers, params })
            .pipe(
                tap(data => this.print('getDocType', data)),
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API post() method => update one docType
    newDocType(docType: DocType) {
        this.helperService.startLoader();
        return this.http.post<DocType>(this.apiURL + 'docs-type', docType, this.headers())
            .pipe(
                tap(data => this.print('newDocType', data)),
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API delete() method => delete one doc type
    deleteDocType(id: string) {
        this.helperService.startLoader();
        return this.http.delete<DocType>(this.apiURL + 'docs-type/' + id,  this.headers())
            .pipe(
                tap(data => this.print('deleteDocType', data)),
                tap(data => {
                    this.helperService.stopLoader();
                }),
                catchError(error => this.handleError(error))
            );
    }

    // HttpClient API put() method => update one category
    updateDocType(docType: DocType) {
        this.helperService.startLoader();
        return this.http.put<DocType>(this.apiURL + 'docs-type', docType, this.headers())
            .pipe(
                tap(data => this.print('updateDocType', data)),
                tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }

    getDocTypesFilter(paginator: MatPaginator, name?: string): Observable<DocTypesRequest> {
        // this.helperService.startLoader();
        let params = new HttpParams();
        const page = paginator.pageIndex + 1;
        params = params.append('limit', String(paginator.pageSize));
        params = params.append('page', String(page));
        if (name) {
            params = params.append('name', name);
        }
        return this.http.get<DocTypesRequest>(this.apiURL + 'docs-type/filter/table', { headers: this.headers().headers, params })
            .pipe(
                // tap(data => this.helperService.stopLoader()),
                catchError(error => this.handleError(error))
            );
    }


    /*========================================
                    Positions
    =========================================*/
    // HttpClient API get() method => Fetch users list
    getAllPositions(): Observable<Position[]> {
        return this.http.get<Position[]>(this.apiURL + 'positions-all', this.headers())
            .pipe(
                tap(data => this.print('getAllPositions', data)),
                catchError(error => this.handleError(error))
            );
    }

    // Error handling
    handleError(error) {
        let errorMessage = '';
        const serror = new ServerError(error.error);
        console.log('serror', serror);
        if (serror.error) {
            // Get client-side error
            if (serror.error.code === 11000) {
                errorMessage = 'El correo ya esta siendo utilizado';
            } else {
                errorMessage = serror.message;
            }
        } else {
            // Get server-side error
            if (error.status === 401) {
                // this.notificationService.showWarning('Advertencia', 'Sera reedireccionado al inicio');
                // setTimeout (() => {
                //     this.adalService.logOut();
                // }, 5000);
                errorMessage = `Error Code: ${error.status} \n Message: Error de autenticación`;

            } else {
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
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

    print(name, data) {
        // console.log('data from ' + name + ':------->', data);
    }
}
