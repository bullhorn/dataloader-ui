// Angular
import { Component } from '@angular/core';
// Vendor
import { NovoModalParams, NovoModalRef } from 'novo-elements';
// App
import { FileService } from '../../providers/file/file.service';

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
})
export class UpdateModalComponent {
  constructor(public params: NovoModalParams,
              private modalRef: NovoModalRef,
              private fileService: FileService) {
  }

  close(): void {
    this.fileService.openFile(this.params['filePath'], false);
    this.modalRef.close();
  }
}
