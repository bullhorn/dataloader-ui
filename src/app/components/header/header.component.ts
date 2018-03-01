// NG
import { Component } from '@angular/core';

// Vendor
import { NovoModalService } from 'novo-elements';

// APP
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private modalService: NovoModalService) {}

  openSettingsModal(): void {
    this.modalService.open(SettingsModalComponent);
  }
}
