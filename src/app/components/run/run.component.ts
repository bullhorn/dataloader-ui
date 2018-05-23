// Angular
import { Component, Input, OnInit } from '@angular/core';
// App
import { IRun } from '../../../interfaces/IRun';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.scss'],
})
export class RunComponent implements OnInit {
  @Input() run: IRun;
  @Input() isSelected: boolean = false;
  fileName: string;
  icon: string;
  theme: string;
  startTime: string;
  duration: string;

  ngOnInit(): void {
    this.fileName = Utils.getFilenameFromPath(this.run.previewData.filePath);
    this.icon = Utils.getIconForFilename(this.fileName);
    this.theme = Utils.getThemeForFilename(this.fileName);
    this.startTime = Utils.getStartTimeString(this.run.results.startTime);
    this.duration = Utils.getDurationString(this.run.results.durationMsec);
  }
}
