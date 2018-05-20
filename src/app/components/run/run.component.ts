// Angular
import { Component, Input, OnInit } from '@angular/core';
// Vendor
import * as moment from 'moment';
// App
import { IRun } from '../../../interfaces/IRun';
import { IDuration } from '../../../interfaces/IDuration';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.scss'],
})
export class RunComponent implements OnInit {
  @Input() run: IRun;
  @Input() isSelected: boolean = false;
  localRunData: { fileName?: string, startTime?: string, duration?: string } = {};
  icon: string = '';
  theme: string = '';

  ngOnInit(): void {
    this.localRunData.fileName = Utils.getFilenameFromPath(this.run.previewData.filePath);
    const formatStr: string = this.run.results.durationMsec < 3600000 ? 'm[m] s[s]' : 'd[d] h[h] m[m]';
    const duration: IDuration = moment.duration(this.run.results.durationMsec) as IDuration;
    this.localRunData.duration = duration.format(formatStr);
    this.localRunData.startTime = Utils.getStartTimeString(this.run.results.startTime);
    this.icon = Utils.getIconForFilename(this.localRunData.fileName);
    this.theme = Utils.getThemeForFilename(this.localRunData.fileName);
  }
}
