import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

    constructor() { }

    exist(key: string): boolean {
      console.log('localStorage.getItem(key) !== null;', localStorage.getItem(key), localStorage.getItem(key) !== null);
      return localStorage.getItem(key) !== null;
    }
    save(key: string, object: any) {
      localStorage.setItem(key, JSON.stringify(object));
    }

    get(key: string) {
      return JSON.parse(localStorage.getItem(key));
    }

    delete(key: string) {
      localStorage.removeItem(key);
    }
}
