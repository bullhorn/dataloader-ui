// Angular
import { Component } from '@angular/core';
// Vendor
import { NovoModalService } from 'novo-elements';
// App
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private modalService: NovoModalService) {}

  openSettingsModal(): void {
    this.modalService.open(SettingsComponent);
  }
}
