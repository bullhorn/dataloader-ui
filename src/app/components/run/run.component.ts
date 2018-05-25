// Angular
import { Component, Input, OnChanges } from '@angular/core';
// App
import { IRun } from '../../../interfaces/IRun';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-run',
  styleUrls: ['./run.component.scss'],
  template: `
    <div class="run" [ngClass]="{'selected': isSelected}">
      <div class="header">
        <i class="{{ icon }} {{ theme }}" theme="entity"></i>
        <div class="filename">{{ fileName }}</div>
      </div>
      <div class="details" *ngIf="run.previewData">
        <div class="rows">{{ total }} Rows</div>
        <div class="start-time" *ngIf="run.results">{{ startTime }}</div>
        <div class="duration" *ngIf="run.results">{{ duration }}</div>
      </div>
    </div>
  `,
})
export class RunComponent implements OnChanges {
  @Input() run: IRun;
  @Input() isSelected: boolean = false;
  fileName: string;
  icon: string;
  theme: string;
  startTime: string;
  total: string;
  duration: string;

  ngOnChanges(): void {
    if (this.run.previewData) {
      this.total = Utils.getAbbreviatedNumber(this.run.previewData.total);
      this.fileName = Utils.getFilenameFromPath(this.run.previewData.filePath);
      this.icon = Utils.getIconForFilename(this.fileName);
      this.theme = Utils.getThemeForFilename(this.fileName);
      if (this.run.results) {
        this.startTime = Utils.getStartTimeString(this.run.results.startTime);
        this.duration = Utils.getDurationString(this.run.results.durationMsec);
      }
    } else {
      this.fileName = 'New Run';
      this.icon = 'bhi-add-thin';
      this.theme = 'white';
    }
  }
}
