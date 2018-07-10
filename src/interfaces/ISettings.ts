export interface IExistField {
  entity: string;
  enabled: boolean;
  fields: string[];
}

export interface ISettings {
  version?: number; // settings version, not app version - used for upgrading existing settings
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
  processEmptyAssociations: boolean;
  numThreads: number;
}
