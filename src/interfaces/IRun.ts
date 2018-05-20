import { IPreviewData } from './IPreviewData';
import { IResults } from './IResults';

export interface IRun {
  previewData: IPreviewData;
  results: IResults;
  output?: string;
}
