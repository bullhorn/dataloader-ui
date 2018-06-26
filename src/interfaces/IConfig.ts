// Configuration file '.config' in user data folder for keeping track of things like onboarding
export interface IConfig {
  onboarded?: boolean; // indicates if about screen has been seen
  uuid?: string; // unique user id (generic, no private data) for analytics
  version?: string; // app version for detection of older user data after an upgrade
}
