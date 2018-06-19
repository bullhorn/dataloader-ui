// Angular
import { Component } from '@angular/core';
// Vendor
import { NovoModalRef } from 'novo-elements';

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html',
})
export class AboutModalComponent {
  constructor(private modalRef: NovoModalRef) {
  }

  close(): void {
    this.modalRef.close();
  }
}
