// Angular
import { Injectable } from '@angular/core';
// Vendor
import * as ua from 'universal-analytics';
import * as uuid from 'uuid/v4';
// App
import { DataloaderService } from '../dataloader/dataloader.service';
import { FileService } from '../file/file.service';
import { IConfig } from '../../../interfaces/IConfig';
import { IRun } from '../../../interfaces/IRun';
import { ISettings } from '../../../interfaces/ISettings';
import { Utils } from '../../utils/utils';

@Injectable()
export class AnalyticsService {
  private analytics: any;

  constructor(private dataloaderService: DataloaderService,
              private fileService: FileService) {
    // Retrieve uuid from the config file, and if it's not there, assign it a new uuid.
    let config: IConfig = this.fileService.readConfig();
    if (!config.uuid) {
      config.uuid = uuid();
      this.fileService.writeConfig(config);
    }
    this.analytics = ua('UA-84038213-1', config.uuid);
  }

  trackEvent(category: string, run: IRun): void {
    this.analytics.event({ ec: category, ea: Utils.getEntityNameFromFile(run.previewData.filePath) }).send();
  }

  trackCompleted(run: IRun, settings: ISettings): void {
    this.analytics.event({
      ec: 'Completed',
      ea: Utils.getEntityNameFromFile(run.previewData.filePath),
      ev: run.results.processed,
      cd1: this.dataloaderService.version(),
      cd2: settings.numThreads,
      cm1: run.results.durationMsec / 1000,
      cm2: run.results.processed,
      cm3: run.results.inserted + run.results.updated,
      cm4: run.results.failed,
    }).send();
  }
}
