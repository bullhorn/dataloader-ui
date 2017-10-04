export class Utils {

  /**
   * Given an array of data from a CSV file, this maps the data to something
   * that can be displayed in the Novo table.
   *
   * @param {any[]} data the data straight from the CSV file
   * @returns {any[]} the swapped data
   */
  static swapColumnsAndRows(data: any[]): any[] {
    let swapped: any[] = [];

    let rowCount: number = 0;
    for (const row of data) {

      let colCount: number = 0;
      for (const col in row) {
        if (rowCount === 0) {
          let entry: any = { column: col };

          // TODO: Default to the fields that are specified in the user's properties file
          if (colCount === 0) {
            entry.duplicateCheck = true;
          } else {
            entry.duplicateCheck = false;
          }

          swapped.push(entry);
        }
        let swappedRow: any[] = swapped[colCount];
        swappedRow['row_' + (rowCount + 1)] = row[col];
        colCount++;
      }
      rowCount++;
    }

    return swapped;
  }

  /**
   * Given a settings object with dataloader properties and a filename to load, this method returns CLI args
   *
   * @param settings the settings object with properties set by the user
   * @param {string} filePath the path to the file to load
   * @returns {string[]} the array of arguments to pass to the CLI
   */
  static createArgs(settings: any, filePath: string): string[] {
    let args: string[] = [];
    args = args.concat(['username', settings.username]);
    args = args.concat(['password', settings.password]);
    args = args.concat(['clientId', settings.clientId]);
    args = args.concat(['clientSecret', settings.clientSecret]);
    args = args.concat(['listDelimiter', settings.listDelimiter]);
    args = args.concat(['dateFormat', settings.dateFormat]);
    args = args.concat(['load', filePath]);
    return args;
  }
}
