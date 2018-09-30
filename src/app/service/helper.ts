import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HelperService {

  hexToByte(str: string) {
    const a = [];
    for (let i = 0, len = str.length; i < len; i += 2) {
      a.push(parseInt(str.substr(i, 2), 16));
    }
    return new Uint8Array(a).buffer as ArrayBuffer;
  }

  byteToHex(buffer) {
    return Array.from(new Uint8Array(buffer), (byte: any) => ('00' + byte.toString(16)).slice(-2)).join('');
  }

  hexToInt(str: string) {
    let result = parseInt(str, 16);
    if ((result & 0x8000) > 0) result -= 0x10000;
    return result;
  }

  parseHex(str: string) {
    const temp = [];
    for (let i = 0; i < str.length; i += 2) {
      temp.push(str.substr(i, 2));
    }
    return temp.reverse().join('');
  }

  hexToAscii(hex) {
    let str = '';
    for (let i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str.split('').reverse().join('');
  }

}

// Hex to Dec
export function d(hex: string) {
  return parseInt(hex, 16);
}
