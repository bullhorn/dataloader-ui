// Angular
import { Component, OnInit } from '@angular/core';
// Vendor
import { NovoModalService } from 'novo-elements';
// App
import { FileService } from '../../providers/file/file.service';
import { ISettings } from '../../../interfaces/ISettings';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private modalService: NovoModalService,
              private fileService: FileService) {
  }

  ngOnInit(): void {
    const settings: ISettings = this.fileService.readSettings();
    if (!settings.username || !settings.password || !settings.clientId || !settings.clientSecret) {
      this.openSettingsModal();
    }
  }

  openSettingsModal(): void {
    this.modalService.open(SettingsComponent);
  }
}
