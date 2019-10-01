export interface ExistField {
  entity: string;
  enabled: boolean;
  fields: string[];
}

export interface Settings {
  version?: number; // settings version, not app version - used for upgrading existing settings
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
  dataCenter: string;
  authorizeUrl: string;
  tokenUrl: string;
  loginUrl: string;
  existFields?: ExistField[];
  listDelimiter: string;
  dateFormat: string;
  processEmptyAssociations: boolean;
  wildcardMatching: boolean;
  singleByteEncoding: boolean;
  numThreads: number;
  caching: boolean;
}
