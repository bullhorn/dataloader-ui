export interface ExistField {
  entity: string;
  enabled: boolean;
  fields: string[];
}

export enum DataCenters {
  'waltham' = 'waltham',
  'east' = 'east',
  'west' = 'west',
  'west50' = 'west50',
  'apac' = 'apac',
  'aus' = 'aus',
  'uk' = 'uk',
  'germany' = 'germany',
  'france' = 'france',
  'bhnext' = 'bhnext',
  'cls91' = 'cls91',
  'cls29' = 'cls29',
  'other' = 'other',
}

export interface Settings {
  version?: number; // settings version, not app version - used for upgrading existing settings
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
  dataCenter: DataCenters;
  authorizeUrl: string;
  tokenUrl: string;
  loginUrl: string;
  existFields?: ExistField[];
  listDelimiter: string;
  dateFormat: string;
  processEmptyAssociations: boolean;
  skipDuplicates: boolean;
  wildcardMatching: boolean;
  singleByteEncoding: boolean;
  executeFormTriggers: boolean;
  numThreads: number;
  caching: boolean;
}
