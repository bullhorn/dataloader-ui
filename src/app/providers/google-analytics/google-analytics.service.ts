// App
import { IRun } from '../../../interfaces/IRun';
import { ISettings } from '../../../interfaces/ISettings';
import { Utils } from '../../utils/utils';

// Reference the global ga variable from index.html
declare const ga: any;

export class GoogleAnalyticsService {

  static setVersion(version: string): void {
    if (typeof ga !== 'undefined') {
      ga('set', 'dimension1', version);
    }
  }

  static trackEvent(category: string, run: IRun): void {
    if (typeof ga !== 'undefined') {
      let entity: string = Utils.getEntityNameFromFile(run.previewData.filePath);
      ga('send', { hitType: 'event', eventCategory: category, eventAction: entity, eventLabel: run.previewData.filePath });
    }
  }

  static trackCompleted(run: IRun, settings: ISettings): void {
    if (typeof ga !== 'undefined') {
      ga('set', 'dimension2', settings.numThreads);
      ga('set', 'metric1', run.results.durationMsec / 1000);
      ga('set', 'metric2', run.results.processed);
      ga('set', 'metric3', run.results.inserted + run.results.updated);
      ga('set', 'metric4', run.results.failed);
      GoogleAnalyticsService.trackEvent('Completed', run);
    }
  }
}
