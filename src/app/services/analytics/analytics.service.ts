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
  private readonly clientID: string;

  constructor(private electronService: ElectronService,
              private fileService: FileService) {
    if (ElectronService.isElectron()) {
      // Retrieve uuid from the config file, and if it's not there, assign it a new uuid.
      const config: Config = this.fileService.readConfig();
      if (!config.uuid) {
        config.uuid = uuid();
        this.fileService.writeConfig(config);
      }
      this.clientID = config.uuid;
    }
  }

  trackEvent(run: Run): void {
    if (ElectronService.isElectron()) {
      const entityName = EntityUtil.getEntityNameFromFile(run.previewData.entity || run.previewData.filePath);
      const rowCount = run.results ? run.results.processed : 0;
      this.sendEvent('purchase', {
        items: [{
          item_name: entityName,
          quantity: rowCount,
          price: 1,
        }],
        value: rowCount,
      });
    }
  }

  async acceptTermsAndConditions(version: number): Promise<void> {
    if (ElectronService.isElectron()) {
      const fullName = await this.electronService.fullName();
      const username = await this.electronService.username();
      const ipAddress = await this.getIpAddress();
      this.sendEvent('login', {
        name: fullName,
        username: username,
        address: ipAddress,
        version: `Version ${version}`,
      });
    }
  }

  private sendEvent(name: string, params: Object): Promise<Response> {
    return fetch(`https://google-analytics.com/mp/collect?measurement_id=G-HH51W1WWJ3&api_secret=2rmO0J1RTTCxJXbK2Y8A4A`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.clientID,
        events: [{ name, params }],
      }),
    });
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
