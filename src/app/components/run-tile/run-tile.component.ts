// NG
import { Component, Input, OnInit } from '@angular/core';
// App
import { IRun } from '../../../interfaces/IRun';
import { Utils } from '../../utils/utils';
// Vendor
import * as moment from 'moment';

@Component({
  selector: 'app-run-tile',
  template: `
    <div class="run-tile-btn" [ngClass]="{'dark': dark}">
      <div>
        <span>{{ localRunData.fileName }}</span>
        <span>{{ run.previewData.total }} {{ 'ROWS' | translate }}</span>
      </div>
      <div>
        <span>{{ localRunData.startTime }}</span>
        <span>{{ localRunData.duration }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./run-tile.component.scss'],
})
export class RunTileComponent implements OnInit {
  @Input() run: IRun;
  @Input() dark: boolean = false;
  localRunData: { fileName?: string, startTime?: string, duration?: string } = {};

  ngOnInit(): void {
    this.localRunData.fileName = Utils.getFilenameFromPath(this.run.previewData.filePath);
    this.localRunData.startTime = moment(this.run.results.startTime).fromNow();
    this.localRunData.duration = moment.duration(this.run.results.durationMsec).humanize();
  }
}
