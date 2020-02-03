// Angular
import { Component } from '@angular/core';
// Vendor
import { NovoModalRef } from 'novo-elements';
import { ElectronService } from '../../services/electron/electron.service';

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html',
})
export class AboutModalComponent {
  constructor(private electronService: ElectronService,
              private modalRef: NovoModalRef) {
  }

  close(): void {
    this.modalRef.close();
  }

  openLink(link: string): void {
    if (ElectronService.isElectron()) {
      this.electronService.shell.openExternal(link);
    }
  }
}
