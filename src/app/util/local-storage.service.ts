import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

    constructor() { }

    exist(key: string): boolean {
      return localStorage.getItem(key) !== null;
    }
    save(key: string, object: any) {
      localStorage.setItem(key, JSON.stringify(object));
    }

    get(key: string) {
      if (this.exist(key)) {
        return JSON.parse(localStorage.getItem(key));
      } else {
        return '';
      }
    }

    saveItem(key: string, object: any) {
      localStorage.setItem(key, object);
    }

    getItem(key: string) {
      return this.exist(key) ? localStorage.getItem(key) : '';
    }

    delete(key: string) {
      localStorage.removeItem(key);
    }

    clear() {
      localStorage.clear();
    }

    saveRol(rol) {
      try {
        const enc = CryptoJS.AES.encrypt(JSON.stringify(rol), 'rol').toString();
        localStorage.setItem('rol', enc);
      } catch (e) {
        console.log(e);
      }
    }
    getRol(): number {
      try {
        const data = localStorage.getItem('rol');
        // console.log('data', data);
        const bytes = CryptoJS.AES.decrypt(data, 'rol');
        if (bytes.toString()) {
          return parseInt(bytes.toString(CryptoJS.enc.Utf8), 0);
        }
        return -1;
      } catch (e) {
        console.log(e);
        return -1;
      }
    }
}
