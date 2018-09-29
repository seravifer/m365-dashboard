import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelperService {

  hexStringToByte(str: string) {
    const a = [];
    for (let i = 0, len = str.length; i < len; i += 2) {
      a.push(parseInt(str.substr(i, 2), 16));
    }
    return new Uint8Array(a).buffer as ArrayBuffer;
  }

  bytesToHex(buffer) {
    return Array.from(new Uint8Array(buffer), (byte: any) => ('00' + byte.toString(16)).slice(-2)).join('');
  }

  reverseHex(str: string) {
    const temp = [];
    for (let i = 0; i < str.length; i += 2) {
      temp.push(str.substr(i, 2));
    }
    return temp.reverse().join();
  }

}
