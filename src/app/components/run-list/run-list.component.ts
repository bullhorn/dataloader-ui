// NG
import { Component, Input } from '@angular/core';
// Vendor
import { IRun } from '../../../interfaces/IRun';

@Component({
  selector: 'app-run-list',
  template: `
    <div class="run-list-wrapper">
      <div class="new-run-btn" *ngIf="!currentRun">
        <i class="bhi-add-thin"></i>{{ 'NEW_RUN' | translate }}
      </div>
      <div class="current-run" *ngIf="currentRun">
        <app-run-tile [run]="currentRun"></app-run-tile>
      </div>
      <div class="historical-runs">
        <app-run-tile *ngFor="let run of runs; let i = index" [run]="run" [dark]="i % 2 === 0"></app-run-tile>
      </div>
    </div>
  `,
  styleUrls: ['./run-list.component.scss'],
})
export class RunListComponent {
  @Input() runs: IRun[];
  @Input() currentRun: IRun|null = null;
}
