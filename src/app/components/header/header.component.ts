// Angular
import { Component, Input } from '@angular/core';
// Vendor
import { NovoModalService } from 'novo-elements';
// App
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() running: boolean;

  constructor(private modalService: NovoModalService) {}

  openSettingsModal(): void {
    this.modalService.open(SettingsModalComponent);
  }
}
