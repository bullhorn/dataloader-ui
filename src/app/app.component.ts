// Angular
import { Component, NgZone, OnInit, ViewContainerRef } from '@angular/core';
// Vendor
import { NovoModalService } from 'novo-elements';
import * as moment from 'moment';
import * as momentDurationFormatSetup from 'moment-duration-format';
// App
import { DataloaderService } from './providers/dataloader/dataloader.service';
import { FileService } from './providers/file/file.service';
import { IRun } from '../interfaces/IRun';
import { IResults } from '../interfaces/IResults';
import { Utils } from './utils/utils';

// Extend moment.duration with fn.format
momentDurationFormatSetup(moment);

// TODO: Reformat all code
/**
 * The main app component responsible for the state of the app.
 * All other components are simple input/output components, this one contains the logic.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  static EMPTY_RUN: IRun = { previewData: null, results: null, output: '\n' };

  currentRun: IRun = Object.assign({}, AppComponent.EMPTY_RUN);
  selectedRun: IRun | null = this.currentRun;
  runHistory: IRun[] = [];

  constructor(private dataloaderService: DataloaderService,
              private fileService: FileService,
              private modalService: NovoModalService,
              private view: ViewContainerRef, // tslint:disable-line
              private zone: NgZone) {
    this.modalService.parentViewContainer = view;
  }

  ngOnInit(): void {
    this.fileService.getAllRuns(this.onRunData.bind(this));
  }

  onStarted(): void {
    this.dataloaderService.onPrint(this.onPrint.bind(this));
    this.dataloaderService.onDone(this.onDone.bind(this));
    this.dataloaderService.start(this.currentRun.previewData);
    this.fileService.onResultsFileChange(this.onResultsFileChange.bind(this));
    this.currentRun.running = true;
  }

  onStopped(): void {
    this.dataloaderService.stop();
  }

  private onRunData(runs: IRun[]): void {
    this.zone.run(() => {
      this.runHistory = runs;
      // If refreshing after a run completed, show that run in the history
      if (this.currentRun.running && this.runHistory.length) {
        this.selectedRun = this.runHistory[0];
        this.selectedRun.output = this.currentRun.output;
        this.currentRun = Object.assign({}, AppComponent.EMPTY_RUN);
      }
    });
  }

  /**
   * Emitted whenever the dataloader process has printed to stdout or stderr. Output is not saved for historical runs
   * but the logfile contains all of the data printed and more.
   */
  private onPrint(text: string): void {
    this.zone.run(() => {
      this.currentRun.output = this.currentRun.output.concat(text);
    });
  }

  /**
   * Emitted from the listener that is notified the instant that the dataloader process has completed, which
   * may happen a second before the final updates to the results file have been processed.
   */
  private onDone(text: string): void {
    this.zone.run(() => {
      this.currentRun.output = this.currentRun.output.concat(text);
      // Wait for final report from results file
      setTimeout(() => {
        this.fileService.unsubscribe();
        this.dataloaderService.unsubscribe();
        this.sendNotification();
        this.fileService.getAllRuns(this.onRunData.bind(this));
      }, 1000);
    });
  }

  /**
   * Emitted from the file watcher that is watching the dataloader results file be updated twice per second
   */
  private onResultsFileChange(results: IResults): void {
    if (results && results.durationMsec) {
      this.zone.run(() => {
        this.currentRun.results = results;
      });
    }
  }

  /**
   * Emits the final system notification that the run has completed
   */
  private sendNotification(): void {
    if (this.currentRun.results) {
      let entity: string = Utils.getEntityNameFromFile(this.currentRun.previewData.filePath);
      let total: string = `${this.currentRun.results.processed.toLocaleString()} / ${this.currentRun.previewData.total.toLocaleString()}`;
      let counts: string = `${this.currentRun.results.inserted} Added, ${this.currentRun.results.updated} Updated, ${this.currentRun.results.failed} Errors`;
      let duration: string = Utils.msecToHMS(this.currentRun.results.durationMsec);
      new Notification(`Loaded ${total} ${entity} Records in ${duration}`, { body: counts }); // tslint:disable-line
    }
  }
}
