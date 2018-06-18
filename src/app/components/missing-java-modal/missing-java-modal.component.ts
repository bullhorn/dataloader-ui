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
      const link: string = this.electronService.process.platform === 'darwin' ?
        'http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html' :
        'http://javadl.oracle.com/webapps/download/AutoDL?BundleId=210182';
      this.electronService.shell.openExternal(link);
    }
    this.modalRef.close();
  }

  close(): void {
    this.modalRef.close();
  }
}
