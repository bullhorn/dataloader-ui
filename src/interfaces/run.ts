import { PreviewData, Results } from './';

export interface Run {
  // The directory that contains the run history data files
  runDirectory: string;

  // The contents of the previewData.json file in the dir
  previewData: PreviewData | null;

  // The contents of the results.json file in the dir
  results: Results | null;

  // The CLI output for this run
  output?: string;

  // True if the run is in progress
  running?: boolean;
}
