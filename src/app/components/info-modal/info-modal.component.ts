// Angular
import { Component } from '@angular/core';
// Vendor
import { NovoModalParams, NovoModalRef } from 'novo-elements';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
})
export class InfoModalComponent {
  constructor(
    public params: NovoModalParams,
    private modalRef: NovoModalRef,
  ) {}

  close(): void {
    this.modalRef.close();
  }
}
