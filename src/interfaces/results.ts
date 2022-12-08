export interface Errors {
  row: number;
  id?: number;
  errorCode: number;
  title: string;
  message: string;
  tipsToResolve: string;
}

export interface Results {
  processed?: number;
  inserted?: number;
  updated?: number;
  skipped?: number;
  deleted?: number;
  failed?: number;
  successFile?: string;
  failureFile?: string;
  logFile?: string;
  startTime?: number;
  durationMsec?: number;
  errors?: Errors[];
}
