// Angular
import { Injectable } from '@angular/core';
// Vendor
import * as ga from 'ga-lite';
import { v4 as uuid } from 'uuid';
// App
import { ElectronService } from '../electron/electron.service';
import { FileService } from '../file/file.service';
import { EntityUtil } from '../../util';
import { Config, Run } from '../../../interfaces';

@Injectable()
export class AnalyticsService {

  constructor(private electronService: ElectronService,
              private fileService: FileService) {
    if (ElectronService.isElectron()) {
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
  }

  trackEvent(category: string, run: Run): void {
    if (ElectronService.isElectron()) {
      // Params: 'send', 'event', category, action, label, value
      ga('send', 'event', category, EntityUtil.getEntityNameFromFile(run.previewData.entity || run.previewData.filePath),
        this.electronService.version(), run.results ? run.results.processed : 0);
    }
  }

  async acceptTermsAndConditions(version: number): Promise<void> {
    if (ElectronService.isElectron()) {
      const username = await this.electronService.username();
      const fullName = await this.electronService.fullName();
      const ipAddress = await this.getIpAddress();
      // Params: 'send', 'event', category, action, label, value
      ga('send', 'event', 'Accepted', `${fullName} (${username})`, ipAddress, version);
    }
  }

  private async getIpAddress() {
    let ipAddress: string;
    try {
      const ip = await this.electronService.getIp();
      ipAddress = `Location: ${ip.replace(/\./g, ' / ')}`;
    } catch (error) {
      ipAddress = 'Error Obtaining Location';
    }
    return ipAddress;
  }
}
