// NG
import { Component, Input } from '@angular/core';
// Vendor
import { IRun } from '../../../interfaces/IRun';

@Component({
  selector: 'app-run-list',
  template: `
    <div class="run-list-wrapper">
      <div class="new-run-btn">
        <i class="bhi-add-thin"></i>NEW RUN
      </div>
      <app-run-tile *ngFor="let run of runs" [run]="run"></app-run-tile>
    </div>
  `,
  styleUrls: ['./run-list.component.scss'],
})
export class RunListComponent {
  @Input() runs: IRun[];
}
