export interface PreviewData {
  // The user selected entity for this data, if available (will not be available for beta versions, which relied on filename only)
  entity?: string;

  // Column mapping created by the user when previewing the data. Keys are column names from the file, values are bullhorn field names.
  columnMap: { [key: string]: string };

  // The file location
  filePath: string;

  // Total number of rows
  total: number;

  // The first row in the data, which should just be the column names
  headers: string[];

  // A handful of rows, for previewing only
  data: Object[];
}
