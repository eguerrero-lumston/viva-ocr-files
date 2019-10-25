import { FoldersRequest } from './../model/folders-request';
import { Folder } from './../model/folder';
import { Manifest } from 'src/app/model/manifest';
import { HelperService } from './helper.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConnectServer {
    headers: HttpHeaders;
    // Define API
    apiURL = environment.URL_HOST;

    constructor(private http: HttpClient) { }

    /*========================================
      CRUD Methods for consuming RESTful API
    =========================================*/

    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type'
            // 'Content-Type': 'application/json'
        })
    };

    // HttpClient API get() method => Fetch employees list
    getManifests(): Observable<Manifest> {
        return this.http.get<Manifest>(this.apiURL + 'docs/', this.httpOptions)
            .pipe(
                catchError(this.handleError)
            );
    }

    getFolders(): Observable<FoldersRequest> {
        return this.http.get<FoldersRequest>(this.apiURL + 'folders/', this.httpOptions)
            .pipe(
                catchError(this.handleError)
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
        // window.alert(errorMessage);
        return throwError(errorMessage);
    }

}
