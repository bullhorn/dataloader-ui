// Angular
import { Component, Input, OnChanges } from '@angular/core';
// App
import { EntityUtil, Util } from '../../util';
import { PreviewData, Results } from '../../../interfaces';

@Component({
  selector: 'app-run',
  styleUrls: ['./run.component.scss'],
  template: `
    <div class="run" [ngClass]="{'selected': isSelected, 'running': running}">
      <div class="header">
        <i class="{{ icon }} {{ theme }}" theme="entity"></i>
        <div class="filename">{{ fileName }}</div>
      </div>
      <div class="details" *ngIf="previewData">
        <div class="rows">{{ total }} Rows</div>
        <div class="start-date" *ngIf="results && !running">{{ startDate }}</div>
        <div class="loading" *ngIf="results && running">Loading</div>
        <div class="duration" *ngIf="results">{{ duration }}</div>
      </div>
    </div>
  `,
})
export class RunComponent implements OnChanges {
  @Input() previewData: PreviewData;
  @Input() results: Results;
  @Input() running: boolean;
  @Input() isSelected = false;
  fileName: string;
  icon: string;
  theme: string;
  startDate: string;
  total: string;
  duration: string;

  ngOnChanges(): void {
    if (this.previewData) {
      this.total = Util.getAbbreviatedNumber(this.previewData.total);
      this.fileName = Util.getFilenameFromPath(this.previewData.filePath);
      this.icon = EntityUtil.getIconForFilename(this.fileName);
      this.theme = EntityUtil.getThemeForFilename(this.fileName);
      if (this.results) {
        this.startDate = Util.getStartDateString(this.results.startTime);
        this.duration = Util.getDurationString(this.results.durationMsec);
      }
    } else {
      this.fileName = 'New Load';
      this.icon = 'bhi-add-thin';
      this.theme = 'white';
    }
  }
}
