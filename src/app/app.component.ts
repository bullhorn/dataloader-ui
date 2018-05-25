// Angular
import { ChangeDetectorRef, Component, NgZone, OnInit, ViewContainerRef } from '@angular/core';
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

  currentRun: IRun = AppComponent.EMPTY_RUN;
  selectedRun: IRun | null = this.currentRun;
  runHistory: IRun[] = [];

  constructor(private dataloaderService: DataloaderService,
              private fileService: FileService,
              private modalService: NovoModalService,
              private view: ViewContainerRef, // tslint:disable-line
              private zone: NgZone,
              private changeDetectorRef: ChangeDetectorRef) {
    this.modalService.parentViewContainer = view;
  }

  ngOnInit(): void {
    this.fileService.getAllRuns(this.onRunData.bind(this));
  }

  onFilePreview(): void {
    // Trigger change detection for currentRun listeners
    this.selectedRun = this.currentRun = Object.assign({}, this.currentRun);
  }

  onStarted(): void {
    this.dataloaderService.onPrint(this.onPrint.bind(this));
    this.dataloaderService.onDone(this.onDone.bind(this));
    this.dataloaderService.start(this.currentRun.previewData);
    this.fileService.onResultsFileChange(this.onResultsFileChange.bind(this));
    this.selectedRun.running = true;
  }

  onStopped(): void {
    this.selectedRun.running = false;
    this.dataloaderService.stop();
    // TODO: Make this happen later to make sure we pick up on the updated loaded totals
    this.fileService.unsubscribe();
    this.dataloaderService.unsubscribe();
    // TODO: Pause, then re-load runHistory and reset currentRun, making the last run... well.. history
    this.selectedRun = this.currentRun = AppComponent.EMPTY_RUN;
  }

  private onRunData(runs: IRun[]): void {
    this.zone.run(() => {
      this.runHistory = runs;
    });
  }

  /**
   * Emitted whenever the dataloader process has printed to stdout or stderr. Output is not saved for historical runs
   * but the logfile contains all of the data printed and more.
   */
  private onPrint(text: string): void {
    this.currentRun.output = this.currentRun.output.concat(text);
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Emitted from the listener that is notified the instant that the dataloader process has completed, which
   * may happen a second before the final updates to the results file have been processed.
   */
  private onDone(text: string): void {
    this.currentRun.output = this.currentRun.output.concat(text);
    // TODO: Make this happen later to make sure we pick up on the updated loaded totals
    this.sendNotification();
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Emitted from the file watcher that is watching the dataloader results file be updated twice per second
   */
  private onResultsFileChange(results: IResults): void {
    if (results && results.durationMsec) {
      this.currentRun.results = results;
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Emits the final system notification that the run has completed
   */
  private sendNotification(): void {
    let options: any = {};
    if (this.currentRun.results) {
      options = { body: `${this.currentRun.results.inserted} Added, ${this.currentRun.results.updated} Updated, ${this.currentRun.results.failed} Errors` };
    }
    let entity: string = Utils.getEntityNameFromFile(this.currentRun.previewData.filePath);
    let duration: string = Utils.msecToHMS(this.currentRun.results.durationMsec);
    new Notification(`Loaded ${this.currentRun.results.processed} / ${this.currentRun.previewData.total} ${entity} Records in ${duration}`, options); // tslint:disable-line
  }
}
