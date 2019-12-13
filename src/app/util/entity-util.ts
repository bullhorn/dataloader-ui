import { EntityTypes } from '@bullhorn/bullhorn-types';
import { Util } from './util';

export class EntityUtil {

  // This is the full list of supported entities from Data Loader. It must be kept up to date manually with:
  // https://github.com/bullhorn/dataloader/blob/master/src/main/java/com/bullhorn/dataloader/enums/EntityInfo.java#L29
  // The EntityInfo enums in Data Loader that have a zero load order are not loadable, they are for lookup only.
  static get ENTITY_NAMES(): EntityTypes[] {
    return [
      EntityTypes.Appointment,
      EntityTypes.AppointmentAttendee,
      EntityTypes.Candidate,
      EntityTypes.CandidateCertification,
      EntityTypes.CandidateEducation,
      EntityTypes.CandidateReference,
      EntityTypes.CandidateWorkHistory,
      EntityTypes.ClientContact,
      EntityTypes.ClientCorporation,
      EntityTypes.HousingComplex,
      EntityTypes.JobOrder,
      EntityTypes.JobSubmission,
      EntityTypes.Lead,
      EntityTypes.Note,
      EntityTypes.NoteEntity,
      EntityTypes.Opportunity,
      EntityTypes.Placement,
      EntityTypes.PlacementChangeRequest,
      EntityTypes.PlacementCommission,
      EntityTypes.Sendout,
      EntityTypes.Task,
      EntityTypes.Tearsheet,
      EntityTypes.ClientCorporationCustomObjectInstance1,
      EntityTypes.ClientCorporationCustomObjectInstance2,
      EntityTypes.ClientCorporationCustomObjectInstance3,
      EntityTypes.ClientCorporationCustomObjectInstance4,
      EntityTypes.ClientCorporationCustomObjectInstance5,
      EntityTypes.ClientCorporationCustomObjectInstance6,
      EntityTypes.ClientCorporationCustomObjectInstance7,
      EntityTypes.ClientCorporationCustomObjectInstance8,
      EntityTypes.ClientCorporationCustomObjectInstance9,
      EntityTypes.ClientCorporationCustomObjectInstance10,
      EntityTypes.ClientCorporationCustomObjectInstance11,
      EntityTypes.ClientCorporationCustomObjectInstance12,
      EntityTypes.ClientCorporationCustomObjectInstance13,
      EntityTypes.ClientCorporationCustomObjectInstance14,
      EntityTypes.ClientCorporationCustomObjectInstance15,
      EntityTypes.ClientCorporationCustomObjectInstance16,
      EntityTypes.ClientCorporationCustomObjectInstance17,
      EntityTypes.ClientCorporationCustomObjectInstance18,
      EntityTypes.ClientCorporationCustomObjectInstance19,
      EntityTypes.ClientCorporationCustomObjectInstance20,
      EntityTypes.ClientCorporationCustomObjectInstance21,
      EntityTypes.ClientCorporationCustomObjectInstance22,
      EntityTypes.ClientCorporationCustomObjectInstance23,
      EntityTypes.ClientCorporationCustomObjectInstance24,
      EntityTypes.ClientCorporationCustomObjectInstance25,
      EntityTypes.ClientCorporationCustomObjectInstance26,
      EntityTypes.ClientCorporationCustomObjectInstance27,
      EntityTypes.ClientCorporationCustomObjectInstance28,
      EntityTypes.ClientCorporationCustomObjectInstance29,
      EntityTypes.ClientCorporationCustomObjectInstance30,
      EntityTypes.ClientCorporationCustomObjectInstance31,
      EntityTypes.ClientCorporationCustomObjectInstance32,
      EntityTypes.ClientCorporationCustomObjectInstance33,
      EntityTypes.ClientCorporationCustomObjectInstance34,
      EntityTypes.ClientCorporationCustomObjectInstance35,
      EntityTypes.JobOrderCustomObjectInstance1,
      EntityTypes.JobOrderCustomObjectInstance2,
      EntityTypes.JobOrderCustomObjectInstance3,
      EntityTypes.JobOrderCustomObjectInstance4,
      EntityTypes.JobOrderCustomObjectInstance5,
      EntityTypes.JobOrderCustomObjectInstance6,
      EntityTypes.JobOrderCustomObjectInstance7,
      EntityTypes.JobOrderCustomObjectInstance8,
      EntityTypes.JobOrderCustomObjectInstance9,
      EntityTypes.JobOrderCustomObjectInstance10,
      EntityTypes.OpportunityCustomObjectInstance1,
      EntityTypes.OpportunityCustomObjectInstance2,
      EntityTypes.OpportunityCustomObjectInstance3,
      EntityTypes.OpportunityCustomObjectInstance4,
      EntityTypes.OpportunityCustomObjectInstance5,
      EntityTypes.OpportunityCustomObjectInstance6,
      EntityTypes.OpportunityCustomObjectInstance7,
      EntityTypes.OpportunityCustomObjectInstance8,
      EntityTypes.OpportunityCustomObjectInstance9,
      EntityTypes.OpportunityCustomObjectInstance10,
      EntityTypes.PersonCustomObjectInstance1,
      EntityTypes.PersonCustomObjectInstance2,
      EntityTypes.PersonCustomObjectInstance3,
      EntityTypes.PersonCustomObjectInstance4,
      EntityTypes.PersonCustomObjectInstance5,
      EntityTypes.PersonCustomObjectInstance6,
      EntityTypes.PersonCustomObjectInstance7,
      EntityTypes.PersonCustomObjectInstance8,
      EntityTypes.PersonCustomObjectInstance9,
      EntityTypes.PersonCustomObjectInstance10,
      EntityTypes.PlacementCustomObjectInstance1,
      EntityTypes.PlacementCustomObjectInstance2,
      EntityTypes.PlacementCustomObjectInstance3,
      EntityTypes.PlacementCustomObjectInstance4,
      EntityTypes.PlacementCustomObjectInstance5,
      EntityTypes.PlacementCustomObjectInstance6,
      EntityTypes.PlacementCustomObjectInstance7,
      EntityTypes.PlacementCustomObjectInstance8,
      EntityTypes.PlacementCustomObjectInstance9,
      EntityTypes.PlacementCustomObjectInstance10,
    ];
  }

  static get ENTITY_ICONS(): any {
    return {
      Appointment: 'appointment',
      AppointmentAttendee: 'appointment',
      Candidate: 'candidate',
      CandidateCertification: 'certification',
      CandidateEducation: 'education',
      CandidateReference: 'users',
      CandidateWorkHistory: 'job',
      ClientContact: 'person',
      ClientCorporation: 'company',
      CustomObject: 'custom-objects',
      DistributionList: 'users',
      HousingComplex: 'home',
      JobOrder: 'job',
      JobSubmission: 'star-o',
      Lead: 'lead',
      Note: 'note',
      NoteEntity: 'note',
      Opportunity: 'opportunity',
      Placement: 'star',
      PlacementChangeRequest: 'republish',
      PlacementCommission: 'commission',
      Sendout: 'sendout',
      Task: 'check-o',
      Tearsheet: 'tearsheet',
    };
  }

  static get ENTITY_THEMES(): any {
    return {
      Candidate: 'candidate',
      ClientContact: 'contact',
      ClientCorporation: 'company',
      JobOrder: 'job',
      Lead: 'lead',
      Note: 'note',
      Opportunity: 'opportunity',
      Placement: 'placement',
      Sendout: 'sendout',
      Submission: 'submission',
    };
  }

  /**
   * Given an entity name or filepath, returns the icon that should be used for it (defaults to circle)
   */
  static getIconForFilename(filePath: string, useBhiPrefix: boolean = true): string {
    let icon = 'circle';
    let entityName: string = EntityUtil.getEntityNameFromFile(filePath);
    if (entityName.includes('CustomObject')) {
      entityName = 'CustomObject';
    }
    if (entityName && EntityUtil.ENTITY_ICONS[entityName]) {
      icon = EntityUtil.ENTITY_ICONS[entityName];
    }
    if (useBhiPrefix) {
      icon = 'bhi-' + icon;
    }
    return icon;
  }

  /**
   * Given an entity name or filepath, returns the theme that should be used for it (defaults to note)
   */
  static getThemeForFilename(filePath: string): string {
    let theme = 'note';
    const entityName: string = EntityUtil.getEntityNameFromFile(filePath);
    if (entityName && EntityUtil.ENTITY_THEMES[entityName]) {
      theme = EntityUtil.ENTITY_THEMES[entityName];
    }
    return theme;
  }

  /**
   * Given filename or filepath, returns the entity name that most closely matches.
   */
  static getEntityNameFromFile(filePath: string): string {
    const fileName: string = Util.getFilenameFromPath(filePath);
    let bestMatch = '';
    EntityUtil.ENTITY_NAMES.forEach((entityName) => {
      if (fileName.toUpperCase().startsWith(entityName.toString().toUpperCase())) {
        if (bestMatch.length < entityName.toString().length) {
          // longer name is better
          bestMatch = entityName.toString();
        }
      }
    });
    return bestMatch;
  }
}
