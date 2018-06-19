// Angular
import { Component } from '@angular/core';
// Vendor
import { ElectronService } from '../../providers/electron/electron.service';
import { NovoModalParams, NovoModalRef } from 'novo-elements';

@Component({
  selector: 'app-missing-java-modal',
  templateUrl: './missing-java-modal.component.html',
})
export class MissingJavaModalComponent {
  constructor(public params: NovoModalParams,
              private electronService: ElectronService,
              private modalRef: NovoModalRef) {
  }

  download(): void {
    if (ElectronService.isElectron()) {
      this.electronService.shell.openExternal('https://java.com/download');
    }
    this.modalRef.close();
  }

  close(): void {
    this.modalRef.close();
  }
}
