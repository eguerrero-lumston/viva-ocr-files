import { Directive, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {

  @Output() onFileDropped = new EventEmitter<any>();

  /*  @HostBinding('style.background-color') private background = '#f5fcff'
   @HostBinding('style.opacity') private opacity = '1' */

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    /* this.background = '#9ecbec';
    this.opacity = '0.8' */
  }
  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    /* this.background = '#f5fcff'
    this.opacity = '1' */
  }
  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    /* this.background = '#f5fcff'
    this.opacity = '1' */
    const files = evt.dataTransfer.files;
      // console.log('value', evt.dataTransfer);

    const filesAccepted1 = [];
    // for (var i = 0; i < files.length; i++) {

    //   // get item
    //   var file = files.item(i);
    //   // console.log('value', file);
    //   if (this.isAcceptable(file.name)){
    //     filesAccepted1.push(file);
    //   }
    // }
    // const filesAccepted = new FileList(filesAccepted1);
    // if (filesAccepted.length > 0) {
    this.onFileDropped.emit(files);
    // }

  }
  constructor() { }

}
