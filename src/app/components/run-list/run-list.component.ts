// NG
import { Component, EventEmitter, Input, Output } from '@angular/core';
// App
import { IRun } from '../../../interfaces/IRun';
// Vendor
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-run-list',
  template: `
    <div class="run-list-wrapper">
      <div class="new-run-btn" *ngIf="!currentRun" [class.selected]="!selectedRun" (click)="clearSelectedRun()">
        <i class="bhi-add-thin"></i>{{ 'NEW_RUN' | translate }}
      </div>
      <div class="current-run" *ngIf="currentRun">
        <app-run-tile [run]="currentRun"></app-run-tile>
      </div>
      <div class="historical-runs">
        <app-run-tile *ngFor="let run of runs; let i = index"
                      (click)="runClicked(i)"
                      [run]="run"
                      [dark]="i % 2 === 0"
                      [translations]="runTileTranslations"
                      [isSelected]="selectedRun === run"></app-run-tile>
      </div>
    </div>
  `,
  styleUrls: ['./run-list.component.scss'],
})
export class RunListComponent {
  @Input() runs: IRun[];
  @Input() currentRun: IRun|null = null;
  @Input() selectedRun: IRun|null = null;
  @Output() selectedRunChanged = new EventEmitter<IRun>();
  runTileTranslations: any = {};

  constructor(translate: TranslateService) {
    translate.get([ 'TODAY', 'YESTERDAY' ]).subscribe((res) => {
      this.runTileTranslations.today = res.TODAY;
      this.runTileTranslations.yesterday = res.YESTERDAY;
    });
  }

  runClicked(index: number): void {
    this.selectedRun = this.runs[index];
    this.selectedRunChanged.emit(this.selectedRun);
  }

  clearSelectedRun(): void {
    this.selectedRun = null;
    this.selectedRunChanged.emit(this.selectedRun);
  }
}
