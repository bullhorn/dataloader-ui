export interface PreviewData {
  // The file location
  filePath: string;

  // The user selected entity for this data, if available
  entity?: string;

  // Total number of rows
  total: number;

  // The first row in the data, which should just be the column names
  headers: string[];

  // A handful of rows, for previewing only
  data: Object[];
}
