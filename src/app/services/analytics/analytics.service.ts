// Angular
import { Injectable } from '@angular/core';
// Vendor
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
    }
  }

  trackEvent(category: string, run: Run): void {
    if (ElectronService.isElectron()) {
      const action = EntityUtil.getEntityNameFromFile(run.previewData.entity || run.previewData.filePath);
      window['gtag']('event', action, {
        event_category: category,
        event_label: this.electronService.version(),
        value: run.results ? run.results.processed : 0,
      });
    }
  }

  async acceptTermsAndConditions(version: number): Promise<void> {
    if (ElectronService.isElectron()) {
      const username = await this.electronService.username();
      const fullName = await this.electronService.fullName();
      const action = `${fullName} (${username})`;
      const ipAddress = await this.getIpAddress();
      window['gtag']('event', action, {
        event_category: 'Accepted',
        event_label: ipAddress,
        value: version,
      });
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
