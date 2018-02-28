// NG
import { Component, Input, OnInit } from '@angular/core';
// App
import { IRun } from '../../../interfaces/IRun';
import { IDuration } from '../../../interfaces/IDuration';
import { Utils } from '../../utils/utils';
// Vendor
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'app-run-tile',
  template: `
    <div class="run-tile-btn" [ngClass]="{'dark': dark, 'selected': isSelected}">
      <div class="run-tile-header">
        <i class="{{icon}} {{theme}}" theme="entity"></i>
        <div class="filename">{{ localRunData.fileName }}</div>
      </div>
      <div class="run-tile-details">
        <div class="rows">{{ run.previewData.total | abbreviatedNumber }} {{ 'ROWS' | translate }}</div>
        <div class="start-time">{{ localRunData.startTime }}</div>
        <div class="duration">{{ localRunData.duration }}</div>
      </div>
    </div>
  `,
  styleUrls: ['./run-tile.component.scss'],
})
export class RunTileComponent implements OnInit {
  @Input() run: IRun;
  @Input() dark: boolean = false;
  @Input() translations: { today: string, yesterday: string };
  @Input() isSelected: boolean = false;
  localRunData: { fileName?: string, startTime?: string, duration?: string } = {};
  icon: string = '';
  theme: string = '';

  ngOnInit(): void {
    this.localRunData.fileName = Utils.getFilenameFromPath(this.run.previewData.filePath);
    const formatStr: string = this.run.results.durationMsec < 3600000 ? 'm[m] s[s]' : 'd[d] h[h] m[m]';
    const duration: IDuration = moment.duration(this.run.results.durationMsec) as IDuration;
    this.localRunData.duration = duration.format(formatStr);
    this.localRunData.startTime = this.getStartTime(this.run.results.startTime);
    this.icon = Utils.getIconForFilename(this.localRunData.fileName);
    this.theme = Utils.getThemeForFilename(this.localRunData.fileName);
  }

  private getStartTime(startTime: Moment|number): string {
    startTime = moment(startTime);

    const ref: Moment = moment();
    const today: Moment = ref.clone().startOf('day');
    const yesterday: Moment = ref.clone().subtract(1, 'days').startOf('day');

    if (startTime.isSame(today, 'd')) {
      return this.translations.today;
    } else if (startTime.isSame(yesterday, 'd')) {
      return this.translations.yesterday;
    } else {
      return moment(this.run.results.startTime).format('M/D/YY');
    }
  }
}
