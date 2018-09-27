import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelperService {

  stringToBytes(string) {
    let array = new Uint8Array(string.length);
    for (let i = 0, l = string.length; i < l; i++) {
      array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

  hexToBytes(hex) {
    let typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16)));  
    return typedArray.buffer
  }

  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }

}