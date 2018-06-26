import { EncryptUtils } from './encrypt-utils';

describe('EncryptUtils', () => {
  let password: string = 'Passw0rd!';

  describe('Method: encrypt', () => {
    it('should provide encryption of plain text', () => {
      expect(EncryptUtils.encrypt(password)).not.toEqual(password);
    });
  });

  describe('Method: decrypt', () => {
    it('should provide decryption of encrypted text', () => {
      expect(EncryptUtils.decrypt(EncryptUtils.encrypt(password))).toEqual(password);
    });
  });
});
