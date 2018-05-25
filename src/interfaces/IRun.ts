import { IPreviewData } from './IPreviewData';
import { IResults } from './IResults';

export interface IRun {
  previewData: IPreviewData | null;
  results: IResults | null;
  output?: string;
  running?: boolean;
}
