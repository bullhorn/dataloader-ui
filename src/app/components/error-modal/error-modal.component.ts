// Angular
import { Component } from '@angular/core';
// Vendor
import { NovoModalParams, NovoModalRef } from 'novo-elements';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
})
export class ErrorModalComponent {
  constructor(public params: NovoModalParams,
              private modalRef: NovoModalRef) {
  }

  close(): void {
    this.modalRef.close();
  }
}
