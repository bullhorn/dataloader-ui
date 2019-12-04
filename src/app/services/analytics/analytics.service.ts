// Angular
import { Injectable } from '@angular/core';
// Vendor
import * as ga from 'ga-lite';
import * as uuid from 'uuid/v4';
// App
import { ElectronService } from '../electron/electron.service';
import { FileService } from '../file/file.service';
import { EntityUtil } from '../../util';
import { Config, Run } from '../../../interfaces';

@Injectable()
export class AnalyticsService {

  constructor(private electronService: ElectronService,
              private fileService: FileService) {
    // Retrieve uuid from the config file, and if it's not there, assign it a new uuid.
    const config: Config = this.fileService.readConfig();
    if (!config.uuid) {
      config.uuid = uuid();
      this.fileService.writeConfig(config);
    }
    // This is the way that the ga-lite grabs the user id
    window.localStorage.setItem('uid', config.uuid);
    ga('create', 'UA-84038213-1');
  }

  trackEvent(category: string, run: Run): void {
    // Params: 'send', 'event', category, action, label, value
    ga('send', 'event', category, EntityUtil.getEntityNameFromFile(run.previewData.entity || run.previewData.filePath),
      this.electronService.version(), run.results ? run.results.processed : 0);
  }
}
