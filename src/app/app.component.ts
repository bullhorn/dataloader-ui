// NG
import { Component, NgZone, OnInit } from '@angular/core';
// Vendor
import { FileService } from './providers/file/file.service';
import { IRun } from '../interfaces/IRun';
import * as moment from 'moment';
import * as momentDurationFormatSetup from 'moment-duration-format';

// Extend moment.duration with fn.format
momentDurationFormatSetup(moment);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  selectedRun: IRun|null = null;
  runs: IRun[];

  constructor(private fileService: FileService,
              private zone: NgZone) {
  }

  ngOnInit(): void {
    this.fileService.getAllRuns(this.onRunData.bind(this));
  }

  onRunData(runs: IRun[]): void {
    this.zone.run(() => {
      this.runs = runs;
    });
  }
}
