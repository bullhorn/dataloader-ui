export interface IErrors {
  row: number;
  id: number;
  message: string;
}

export interface IResults {
  processed?: number;
  inserted?: number;
  updated?: number;
  deleted?: number;
  failed?: number;
  successFile?: string;
  failureFile?: string;
  logFile?: string;
  startTime?: number;
  durationMsec?: number;
  errors?: IErrors[];
}
