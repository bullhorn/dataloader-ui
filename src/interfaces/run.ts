import { PreviewData, Results } from './';

export interface Run {
  previewData: PreviewData | null;
  results: Results | null;
  output?: string;
  running?: boolean;
}
