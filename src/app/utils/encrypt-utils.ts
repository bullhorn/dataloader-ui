// Vendor
import { AES, enc } from 'crypto-js';

export class EncryptUtils {
  static PASSWORD = 'viKing-761-biSCuIT';

  static encrypt(text: string): string {
    return AES.encrypt(text, this.PASSWORD).toString();
  }

  static decrypt(text: string): string {
    return AES.decrypt(text, this.PASSWORD).toString(enc.Utf8);
  }
}
