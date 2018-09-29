import { Scooter } from './../models/scooter';
import { HelperService } from './helper';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  private _scooterData: Scooter = {};
  private _lastResponse;

  constructor(
    private helper: HelperService
  ) { }

  get scooterData() {
    return this._scooterData;
  }

  hendleResponse(data: string) {
    let dataType = data.slice(10, 12);
    let lengthContent = (parseInt(data.slice(4, 6), 16) - 2) * 2;
    let dataContent = data.slice(12, 12 + lengthContent);
    dataContent = this.helper.reverseHex(dataContent);
    console.log(dataType, lengthContent, dataContent);

    if (lengthContent > 20 && !this._lastResponse) {
       this._lastResponse = data;
       return;
    } else if (this._lastResponse) {
      data = this._lastResponse + data;
      dataType = data.slice(10, 12);
      lengthContent = (parseInt(data.slice(4, 6), 16) - 2) * 2;
      dataContent = data.slice(12, 12 + lengthContent);
      dataContent = this.helper.reverseHex(dataContent);
      this._lastResponse = null;
    }

    this.selectParser(dataType, dataContent);
  }

  selectParser(dataType: string, dataContent: string) {
    switch (dataType) {
      case 'b5': this.parseSpeed(dataContent); break;
      case '32': this.parseBattery(dataContent); break;
      case '33': this.parseAmp(dataContent); break;
      case 'b9': this.parseDistance(dataContent); break;
      case '34': this.parseVoltage(dataContent); break;

      case '31': this.parseMasterBattery(dataContent); break;
      case 'b0': this.parseMasterInfo(dataContent); break;

      case '7c': this.parseCruise(dataContent); break;
      case '7d': this.parseLight(dataContent); break;
      case 'b2': this.parseLock(dataContent); break;
      case '7b': this.parseRecovery(dataContent); break;
      default: break;
    }
  }

  parseSpeed(data: string) {
    const value = this.helper.hexToInt(data) / 1000;
    const speed = Math.round(value * 10) / 10;
    this._scooterData.speed = speed;
    if (speed > this._scooterData.speed) this._scooterData.max_speed = speed;
  }

  parseBattery(data: string) {
    const value = parseInt(data, 16);
    this._scooterData.battery_life = value;
  }

  parseAmp(data: string) {
    const value = parseInt(data, 16);
    this._scooterData.current_ampere = value / 100;
  }

  parseDistance(data: string) {
    const value = parseInt(data, 16);
    this._scooterData.distance_travelled = value / 100;
  }

  parseVoltage(data: string) {
    const value = parseInt(data, 16);
    this._scooterData.current_voltage = value / 100;
  }

  parseMasterBattery(data: string) {
    const value = data.match(/.{1,4}/g);
    this._scooterData.battery_temp1 = parseInt(value[0].slice(0, 2), 16) - 20;
    this._scooterData.battery_temp2 = parseInt(value[0].slice(2, 4), 16) - 20;
    this._scooterData.current_voltage = parseInt(value[1], 16) / 100;
    this._scooterData.current_ampere = parseInt(value[2], 16) / 100;
    this._scooterData.battery_life = parseInt(value[3], 16);
    this._scooterData.remaining_capacity = parseInt(value[4], 16);
  }

  parseMasterInfo(data: string) {
    const value = data.match(/.{1,4}/g);
    this._scooterData.motor_temperature = parseInt(value[4], 16) / 10;
    this._scooterData.total_distance = parseInt(value[7] + value[8], 16) / 1000;
    this._scooterData.avg_speed = parseInt(value[9], 16) / 1000;
    this._scooterData.speed = parseInt(value[10], 16) / 1000;
    this._scooterData.battery_life = parseInt(value[11], 16);
  }

  parseCruise(data: string) {
    if (data === '0000') this._scooterData.cruise_mode = false;
    else this._scooterData.cruise_mode = true;
  }

  parseLight(data: string) {
    if (data === '0000') this._scooterData.light_mode = false;
    else this._scooterData.light_mode = true;
  }

  parseLock(data: string) {
    if (data === '0200') this._scooterData.lock_mode = true;
    else this._scooterData.lock_mode = false;
  }

  parseRecovery(data: string) {
    if (data === '0000') this._scooterData.recovery_mode = 0;
    else if (data === '0100') this._scooterData.recovery_mode = 1;
    else if (data === '0200') this._scooterData.recovery_mode = 2;

  }

}
