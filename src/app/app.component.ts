// Angular
import { Component, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
// Vendor
import * as moment from 'moment';
import * as momentDurationFormatSetup from 'moment-duration-format';
import { NovoModalService, NovoToastService } from 'novo-elements';
// App
import { AboutModalComponent } from './components/about-modal/about-modal.component';
import { AnalyticsService } from './services/analytics/analytics.service';
import { Config, Results, Run, Settings } from '../interfaces';
import { DataloaderService } from './services/dataloader/dataloader.service';
import { ElectronService } from './services/electron/electron.service';
import { FileService } from './services/file/file.service';
import { InfoModalComponent } from './components/info-modal/info-modal.component';
import { MissingJavaModalComponent } from './components/missing-java-modal/missing-java-modal.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { EntityUtil, Util } from './util';

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
  static EMPTY_RUN: Run = { runDirectory: '', previewData: null, results: null, output: '\n' };

  currentRun: Run = Object.assign({}, AppComponent.EMPTY_RUN);
  selectedRun: Run | null = this.currentRun;
  runHistory: Run[] = [];

  constructor(private analyticsService: AnalyticsService,
              private dataloaderService: DataloaderService,
              private electronService: ElectronService,
              private fileService: FileService,
              private modalService: NovoModalService,
              private toaster: NovoToastService,
              private titleService: Title,
              private view: ViewContainerRef, // tslint:disable-line
              private zone: NgZone) {
    this.modalService.parentViewContainer = view;
    this.toaster.parentViewContainer = view;
  }

  ngOnInit(): void {
    this.titleService.setTitle(`Bullhorn Data Loader v${this.electronService.version()}`);

    // Subscribe to messages from the main process
    this.dataloaderService.onMessages((error) => {
      this.modalService.open(InfoModalComponent, error);
    }, (error) => {
      this.modalService.open(MissingJavaModalComponent, error);
    }, () => {
      this.zone.run(() => {
        this.modalService.open(AboutModalComponent);
      });
    });

    // Initialize run history
    this.fileService.getAllRuns(this.onRunData.bind(this));
    this.fileService.runDeleted.subscribe(this.onRunDeleted.bind(this));

    // Disable drag and drop to stop electron from redirecting away from the app to the dropped file
    document.addEventListener('dragover', (event) => event.preventDefault());
    document.addEventListener('drop', (event) => event.preventDefault());

    // Show settings modal if user has not filled in the credentials section
    const settings: Settings = this.fileService.readSettings();
    if (!settings.username || !settings.password || !settings.clientId || !settings.clientSecret) {
      this.modalService.open(SettingsModalComponent);
    }

    // Show about modal if this is the first time the user is opening the app
    const config: Config = this.fileService.readConfig();
    if (!config.acceptedLicenseVersion || config.acceptedLicenseVersion !== ElectronService.LICENSE_VERSION) {
      this.modalService.open(AboutModalComponent);
    }
  }

  onStarted(): void {
    this.dataloaderService.onPrint(this.onPrint.bind(this), 'load');
    this.dataloaderService.onDone(this.onDone.bind(this), 'load');
    this.dataloaderService.load(this.currentRun.previewData);
    this.fileService.onResultsFileChange(this.onResultsFileChange.bind(this));
    this.currentRun.running = true;
    this.analyticsService.trackEvent('Load', this.currentRun);
  }

  onStopped(): void {
    this.analyticsService.trackEvent('Stopped', this.currentRun);
    this.dataloaderService.stop();
  }

  private onRunData(runs: Run[]): void {
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
   * Moves run selection to the next most logical run in the run history following a deletion.
   */
  private onRunDataPostDelete(runs: Run[]): void {
    this.zone.run(() => {
      const selectedIndex = this.runHistory.indexOf(this.selectedRun);
      this.runHistory = runs;
      if (this.runHistory.length) {
        this.selectedRun = this.runHistory[Math.min(this.runHistory.length - 1, selectedIndex)];
      } else {
        this.selectedRun = this.currentRun = Object.assign({}, AppComponent.EMPTY_RUN);
      }
    });
  }

  /**
   * Refresh the run history when there are changes on disk (a run directory deleted).
   */
  private onRunDeleted(): void {
    this.fileService.getAllRuns(this.onRunDataPostDelete.bind(this));
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
      this.fileService.writeOutputFile(this.currentRun.output);
      // Wait a second for final report from results file (final file changes can occur just after CLI process exits)
      setTimeout(() => {
        this.fileService.unsubscribe();
        this.dataloaderService.unsubscribe();
        this.sendNotification();
        this.fileService.getAllRuns(this.onRunData.bind(this)); // refreshes data
      }, 1000);
    });
  }

  /**
   * Emitted from the file watcher that is watching the dataloader results file be updated twice per second
   */
  private onResultsFileChange(results: Results): void {
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
      this.analyticsService.trackEvent('Completed', this.currentRun);
      const entity = EntityUtil.getEntityNameFromFile(this.currentRun.previewData.entity || this.currentRun.previewData.filePath);
      const total = `${this.currentRun.results.processed.toLocaleString()} / ${this.currentRun.previewData.total.toLocaleString()}`;
      const counts =
        `${this.currentRun.results.inserted} Added, ${this.currentRun.results.updated} Updated, ${this.currentRun.results.failed} Errors`;
      const duration = Util.msecToHMS(this.currentRun.results.durationMsec);
      new Notification(`Loaded ${total} ${entity} Records in ${duration}`, { body: counts }); // tslint:disable-line
    }
  }
}
