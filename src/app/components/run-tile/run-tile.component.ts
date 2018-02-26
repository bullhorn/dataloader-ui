// NG
import { Component, Input } from '@angular/core';
// Vendor
import { IRun } from '../../../interfaces/IRun';

@Component({
  selector: 'app-run-tile',
  template: `
    
  `,
  styleUrls: ['./run-tile.component.scss'],
})
export class RunTileComponent {
  @Input() run: IRun;
}
