import { Injectable } from '@angular/core';

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
      return localStorage.getItem(key);
    }

    delete(key: string) {
      localStorage.removeItem(key);
    }
}
