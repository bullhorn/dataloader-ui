// Configuration file '.config' in user data folder for keeping track of things like onboarding
export interface Config {
  uuid?: string; // unique user id (generic, no private data) for analytics
  version?: string; // app version for detection of older user data after an upgrade
  acceptedLicenseVersion?: number; // if present, represents the version of terms of use that have been accepted
}
