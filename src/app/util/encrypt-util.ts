// Vendor
import { AES, enc } from 'crypto-js';

export class EncryptUtil {
  static PHRASE = 'viKing-761-biSCuIT';

  static encrypt(text: string): string {
    return AES.encrypt(text, this.PHRASE).toString();
  }

  static decrypt(text: string): string {
    return AES.decrypt(text, this.PHRASE).toString(enc.Utf8);
  }
}
