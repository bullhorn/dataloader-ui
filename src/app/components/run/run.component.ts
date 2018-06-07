// Angular
import { Component, Input, OnChanges } from '@angular/core';
// App
import { Utils } from '../../utils/utils';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { IResults } from '../../../interfaces/IResults';

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
        <div class="start-date" *ngIf="results">{{ startDate }}</div>
        <div class="duration" *ngIf="results">{{ duration }}</div>
      </div>
    </div>
  `,
})
export class RunComponent implements OnChanges {
  @Input() previewData: IPreviewData;
  @Input() results: IResults;
  @Input() running: boolean;
  @Input() isSelected: boolean = false;
  fileName: string;
  icon: string;
  theme: string;
  startDate: string;
  total: string;
  duration: string;

  ngOnChanges(): void {
    if (this.previewData) {
      this.total = Utils.getAbbreviatedNumber(this.previewData.total);
      this.fileName = Utils.getFilenameFromPath(this.previewData.filePath);
      this.icon = Utils.getIconForFilename(this.fileName);
      this.theme = Utils.getThemeForFilename(this.fileName);
      if (this.results) {
        this.startDate = Utils.getStartDateString(this.results.startTime);
        this.duration = Utils.getDurationString(this.results.durationMsec);
      }
    } else {
      this.fileName = 'New Load';
      this.icon = 'bhi-add-thin';
      this.theme = 'white';
    }
  }
}
