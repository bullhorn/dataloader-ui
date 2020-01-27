// Angular
import { AfterViewInit, Component, ElementRef, EventEmitter, NgZone, OnDestroy, Output } from '@angular/core';
// App
import { FileService } from '../../services/file/file.service';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss'],
})
export class DropzoneComponent implements AfterViewInit, OnDestroy {
  @Output() onFilePath: EventEmitter<string> = new EventEmitter();
  dragging = false;
  private commands: any;
  private target: any;

  private static isDragFileEvent(event: any): boolean {
    const { types } = event.dataTransfer;
    return types && types.length && types.includes('Files');
  }

  private static noOpHandler(event: any): void {
    event.preventDefault(); // do nothing here
  }

  constructor(private element: ElementRef,
              private fileService: FileService,
              private zone: NgZone) {
  }

  ngAfterViewInit(): void {
    this.commands = {
      dragenter: this.dragEnterHandler.bind(this),
      dragleave: this.dragLeaveHandler.bind(this),
      dragover: DropzoneComponent.noOpHandler,
      drop: this.dropHandler.bind(this),
    };
    ['dragenter', 'dragleave', 'dragover', 'drop'].forEach((type) => {
      this.element.nativeElement.addEventListener(type, this.commands[type]);
    });
  }

  ngOnDestroy(): void {
    ['dragenter', 'dragleave', 'dragover', 'drop'].forEach((type) => {
      this.element.nativeElement.removeEventListener(type, this.commands[type]);
    });
  }

  browse(): void {
    this.fileService.browseForFile(this.onFileProvided.bind(this));
  }

  private dragEnterHandler(event: any): void {
    event.preventDefault();
    if (DropzoneComponent.isDragFileEvent(event)) {
      event.dataTransfer.dropEffect = 'copy';
      this.dragging = true;
      this.target = event.target;
    }
  }

  private dragLeaveHandler(event: any): void {
    event.preventDefault();
    if (this.target === event.target) {
      this.dragging = false;
    }
  }

  private dropHandler(event: any): void {
    event.preventDefault();
    if (DropzoneComponent.isDragFileEvent(event)) {
      const file = event.dataTransfer.files[0];
      this.onFileProvided(file.path || file.name); // path for electron, name for 'ng serve'
      this.dragging = false;
    }
  }

  private onFileProvided(filePath: string) {
    if (filePath) {
      this.zone.run(() => {
        this.onFilePath.emit(filePath);
      });
    }
  }
}
