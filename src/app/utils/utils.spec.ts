import { Utils } from './utils';

describe('Utils', () => {
  describe('Method: getIconForFilename(filePath)', () => {
    it('should get the longest possible entity name', () => {
      expect(Utils.getIconForFilename('CandidateWorkHistoryTest.csv')).toEqual('bhi-job');
      expect(Utils.getIconForFilename('Candidate_WorkHistoryTest.csv')).toEqual('bhi-candidate');
      expect(Utils.getIconForFilename('MyCandidate_WorkHistoryTest.csv')).toEqual('bhi-circle');
      expect(Utils.getIconForFilename('Placement-CustomObjectTest.csv')).toEqual('bhi-star');
      expect(Utils.getIconForFilename('Note-1.csv')).toEqual('bhi-note');
    });
  });

  describe('Method: getEntityNameFromFile(filePath)', () => {
    it('should get the longest possible entity name', () => {
      expect(Utils.getEntityNameFromFile('CandidateWorkHistoryTest.csv')).toEqual('CandidateWorkHistory');
      expect(Utils.getEntityNameFromFile('Candidate_WorkHistoryTest.csv')).toEqual('Candidate');
      expect(Utils.getEntityNameFromFile('MyCandidate_WorkHistoryTest.csv')).toEqual('');
      expect(Utils.getEntityNameFromFile('PlacementCustomObjectInstance1234.csv')).toEqual('PlacementCustomObjectInstance1');
      expect(Utils.getEntityNameFromFile('Placement-CustomObjectTest.csv')).toEqual('Placement');
    });
  });
});
