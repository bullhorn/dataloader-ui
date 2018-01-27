// Angular
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() settingsClicked: EventEmitter<void> = new EventEmitter<void>();

  onSettingsClicked(): void {
    this.settingsClicked.emit();
  }
}
