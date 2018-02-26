// NG
import { Component, Input } from '@angular/core';
// Vendor
import { IRun } from '../../../interfaces/IRun';

@Component({
  selector: 'app-run-list',
  template: `
    <div class="run-list-wrapper">
      <app-run-tile *ngFor="let run of runs" [run]="run"></app-run-tile>
    </div>
  `,
  styleUrls: ['./run-list.component.scss'],
})
export class RunListComponent {
  @Input() runs: IRun[];
}
