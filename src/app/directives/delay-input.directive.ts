import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appDelayInput]'
})
export class DelayInputDirective {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;
  constructor() { }

  @HostListener('keydown', ['$event']) changeInputText($event) {
    this.value = $event.target.value.toUpperCase();
    this.ngModelChange.emit(this.value);
  }
}
