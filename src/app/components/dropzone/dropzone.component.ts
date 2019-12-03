// Angular
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss'],
})
export class DropzoneComponent implements AfterViewInit, OnDestroy {
  @Input() selector: string;
  @Output() onDrop: EventEmitter<any> = new EventEmitter();
  private visible = false;
  private commands: any;
  private target: any;
  private element: any;

  private static isDragFileEvent(event: any): boolean {
    const { types } = event.dataTransfer;
    return types && types.length && types.includes('Files');
  }

  private static noOpHandler(event: any): void {
    event.preventDefault();
    // do nothing
  }

  ngAfterViewInit(): void {
    this.commands = {
      dragenter: this.dragEnterHandler.bind(this),
      dragleave: this.dragLeaveHandler.bind(this),
      dragover: DropzoneComponent.noOpHandler,
      drop: this.dropHandler.bind(this),
    };
    // TODO: Remove selector and use this element?
    this.element = document.querySelector(this.selector);

    ['dragenter', 'dragleave', 'dragover', 'drop'].forEach((type) => {
      if (this.element) {
        this.element.addEventListener(type, this.commands[type]);
      }
    });
  }

  ngOnDestroy(): void {
    ['dragenter', 'dragleave', 'dragover', 'drop'].forEach((type) => {
      if (this.element) {
        this.element.removeEventListener(type, this.commands[type]);
      }
    });
  }

  browse(): void {
    console.log('TODO: Browse for file...');
  }

  private dragEnterHandler(event: any): void {
    event.preventDefault();

    if (!DropzoneComponent.isDragFileEvent(event)) {
      return;
    }

    event.dataTransfer.dropEffect = 'copy';
    this.visible = true;
    this.target = event.target;
  }

  private dragLeaveHandler(event: any): void {
    event.preventDefault();
    if (this.target === event.target) {
      this.visible = false;
    }
  }

  private dropHandler(dragEvent: any): void {
    dragEvent.preventDefault();

    if (!DropzoneComponent.isDragFileEvent(dragEvent)) {
      return;
    }

    const file: any = dragEvent.dataTransfer.files[0];
    if (file) {
      this.onDrop.emit(file);
    }
    this.visible = false;
  }
}
