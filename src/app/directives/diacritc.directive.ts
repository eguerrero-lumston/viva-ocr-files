import { Directive, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDiacritic]'
})
export class DiacriticDirective {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;
  constructor(private el: ElementRef) {
 }

  @HostListener('keydown', ['$event']) changeInputText($event) {
    this.value = this.accentsTidy($event.target.value);
    // console.log('this.el', this.el, this.value);
    this.el.nativeElement.value = this.value;
    this.ngModelChange.emit(this.value);
  }
  @HostListener('input', ['$event']) onInputChange($event) {
    this.value = this.accentsTidy($event.target.value);
    // console.log('this.el', this.el, this.value);
    this.el.nativeElement.value = this.value;
    this.ngModelChange.emit(this.value);
  }

  accentsTidy(s) {
    let r = s.toLowerCase();
    // r = r.replace(new RegExp(/\s/g), '');
    r = r.replace(new RegExp(/[àáâãäå]/g), 'a');
    r = r.replace(new RegExp(/æ/g), 'ae');
    r = r.replace(new RegExp(/ç/g), 'c');
    r = r.replace(new RegExp(/[èéêë]/g), 'e');
    r = r.replace(new RegExp(/[ìíîï]/g), 'i');
    r = r.replace(new RegExp(/ñ/g), 'n');
    r = r.replace(new RegExp(/[òóôõö]/g), 'o');
    r = r.replace(new RegExp(/œ/g), 'oe');
    r = r.replace(new RegExp(/[ùúûü]/g), 'u');
    r = r.replace(new RegExp(/[ýÿ]/g), 'y');
    // r = r.replace(new RegExp(/\W/g), '');
    return r;
  }
}
