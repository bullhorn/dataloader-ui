// NG
import { Component, Input, OnInit } from '@angular/core';
// App
import { IRun } from '../../../interfaces/IRun';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-run-tile',
  template: `
    <div class="run-tile-btn">
      <div>
        <i class="bhi-file"></i>{{ localRunData.fileName }}
      </div>
      <div>
        <i class="bhi-custom-objects"></i>{{ run.previewData.total }}
      </div>
      <div>
        {{ run.results.startTime | date:'MM/dd/yy HH:mm' }} - {{ localRunData.endTime | date:'MM/dd/yy HH:mm' }}
      </div>
    </div>
  `,
  styleUrls: ['./run-tile.component.scss'],
})
export class RunTileComponent implements OnInit {
  @Input() run: IRun;
  localRunData: { fileName?: string } = {};

  ngOnInit(): void {
    this.localRunData.fileName = Utils.getFilenameFromPath(this.run.previewData.filePath);
  }
}
