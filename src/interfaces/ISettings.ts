export interface IExistField {
  entity: string;
  enabled: boolean;
  fields: string[];
}

export interface ISettings {
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
  dataCenter: string;
  authorizeUrl: string;
  tokenUrl: string;
  loginUrl: string;
  existFields?: IExistField[];
  listDelimiter: string;
  dateFormat: string;
  numThreads: number;
}
