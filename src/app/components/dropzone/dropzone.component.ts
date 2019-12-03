// Angular
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
// App
import { FileService } from '../../services/file/file.service';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss'],
})
export class DropzoneComponent implements AfterViewInit, OnDestroy {
  @Input() selector: string;
  @Output() onFilePath: EventEmitter<string> = new EventEmitter();
  private dragging = false;
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

  constructor(private fileService: FileService) {
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
    this.fileService.browseForFile(this.onFileProvided.bind(this));
  }

  private dragEnterHandler(event: any): void {
    event.preventDefault();

    if (!DropzoneComponent.isDragFileEvent(event)) {
      return;
    }

    event.dataTransfer.dropEffect = 'copy';
    this.dragging = true;
    this.target = event.target;
  }

  private dragLeaveHandler(event: any): void {
    event.preventDefault();
    if (this.target === event.target) {
      this.dragging = false;
    }
  }

  private dropHandler(dragEvent: any): void {
    dragEvent.preventDefault();

    if (!DropzoneComponent.isDragFileEvent(dragEvent)) {
      return;
    }

    const file = dragEvent.dataTransfer.files[0];
    this.onFileProvided(file.path || file.name); // path for electron, name for 'ng serve'
    this.dragging = false;
  }

  private onFileProvided(filePath: string) {
    if (filePath) {
      this.onFilePath.emit(filePath);
    }
  }
}
