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
    <div class="run-tile-btn">
      <div>
        <span>{{ localRunData.fileName }}</span>
        <span>{{ run.previewData.total }} rows</span>
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
  localRunData: { fileName?: string, startTime?: string, duration?: string } = {};

  ngOnInit(): void {
    this.localRunData.fileName = Utils.getFilenameFromPath(this.run.previewData.filePath);
    this.localRunData.startTime = moment(this.run.results.startTime).fromNow();
    this.localRunData.duration = moment.duration(this.run.results.durationMsec).humanize();
  }
}
