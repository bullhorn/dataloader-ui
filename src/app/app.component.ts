// Angular
import { Component, NgZone, OnInit, ViewContainerRef } from '@angular/core';
// Vendor
import { NovoModalService } from 'novo-elements';
import * as moment from 'moment';
import * as momentDurationFormatSetup from 'moment-duration-format';
// App
import { FileService } from './providers/file/file.service';
import { IRun } from '../interfaces/IRun';

// Extend moment.duration with fn.format
momentDurationFormatSetup(moment);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  selectedRun: IRun | null = null;
  currentRun: IRun | null = null;
  runs: IRun[];

  constructor(private fileService: FileService,
              private modalService: NovoModalService,
              private view: ViewContainerRef,   // tslint:disable-line
              private zone: NgZone) {
    this.modalService.parentViewContainer = view;
  }

  ngOnInit(): void {
    this.fileService.getAllRuns(this.onRunData.bind(this));
  }

  onRunData(runs: IRun[]): void {
    this.zone.run(() => {
      this.runs = runs;
    });
  }

  // TODO: Fix this
  setCurrentRun(run: IRun): void {
    this.currentRun = run;
  }
}
