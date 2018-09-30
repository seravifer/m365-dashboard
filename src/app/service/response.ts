import { Scooter } from './../models/scooter';
import { HelperService, d } from './helper';
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
    let lengthContent = (d(data.slice(4, 6)) - 2) * 2;
    let dataContent = data.slice(12, 12 + lengthContent);
    dataContent = this.helper.parseHex(dataContent);
    console.log(dataType, lengthContent, dataContent);

    if (lengthContent > 10 * 2 && !this._lastResponse) {
       this._lastResponse = data;
       return;
    } else if (this._lastResponse) {
      data = this._lastResponse + data;
      dataType = data.slice(10, 12);
      lengthContent = (d(data.slice(4, 6)) - 2) * 2;
      dataContent = data.slice(12, 12 + lengthContent);
      dataContent = this.helper.parseHex(dataContent);
      this._lastResponse = null;
    }

    this.selectParser(dataType, dataContent);
  }

  selectParser(dataType: string, dataContent: string) {
    switch (dataType) {
      case '10': this.parseSerial(dataContent); break;
      case '1a': this.parseFirmware(dataContent); break;
      case '67': this.parseBMS(dataContent); break;

      case 'b0': this.parseMasterInfo(dataContent); break;

      case 'b9': this.parseDistance(dataContent); break;
      case '3a': this.parseTravell(dataContent); break;
      case '25': this.parseRemainigDistance(dataContent); break;

      case '31': this.parseMasterBattery(dataContent); break;
      case '10': this.parseBatteryInfo(dataContent); break;
      case '1b': this.parseCycleCharge(dataContent); break;
      case '40': this.parseVoltageByCell(dataContent); break;

      case '7c': this.parseCruise(dataContent); break;
      case '7d': this.parseLight(dataContent); break;
      case 'b2': this.parseLock(dataContent); break;
      case '7b': this.parseRecovery(dataContent); break;
      default: break;
    }
  }

  parseSerial(data: string) {
    this._scooterData.serial_number = d(data);
  }

  parseFirmware(data: string) {
    this._scooterData.firmware_version = +data;
  }

  parseBMS(data: string) {
    const value = data.match(/.{1,4}/g);
    this._scooterData.bms_code = +value[0];
  }

  parseDistance(data: string) {
    this._scooterData.distance_travelled = d(data) / 100;
  }

  parseTravell(data: string) {
    const value = data.match(/.{1,4}/g);
    // TODO
    console.log(d(value[1]) + 's');
    console.log(d(value[0]) + 'm');
    this._scooterData.distance_travelled = d(value[0]);
    this._scooterData.ridding_time = d(value[1]);
  }

  parseRemainigDistance(data: string) {
    this._scooterData.distance_remaining = d(data) / 100;
  }

  parseMasterBattery(data: string) {
    const value = data.match(/.{1,4}/g);
    this._scooterData.battery_temp1 = d(value[0].slice(0, 2)) - 20;
    this._scooterData.battery_temp2 = d(value[0].slice(2, 4)) - 20;
    this._scooterData.current_voltage = d(value[1]) / 100;
    this._scooterData.current_ampere = d(value[2]) / 100;
    this._scooterData.battery_life = d(value[3]);
    this._scooterData.battery_remaining_capacity = d(value[4]);
  }

  parseBatteryInfo(data: string) {
    this._scooterData.battery_design_capacity = d(data.slice(0, 5));
    // TODO
  }

  parseCycleCharge(data: string) {
    this._scooterData.battery_charges = d(data);
  }

  parseVoltageByCell(data: string) {
    const value = data.match(/.{1,4}/g);
    this._scooterData.voltage_cells = [];
    for (let i = value.length - 1; i < 5; i--) {
      this._scooterData.voltage_cells.push(d(value[i]) / 1000);
    }
  }

  parseMasterInfo(data: string) {
    const value = data.match(/.{1,4}/g);
    this._scooterData.motor_temperature = d(value[4]) / 10;
    this._scooterData.distance_travelled = d(value[6]);
    this._scooterData.total_distance = d(value[7] + value[8]) / 1000;
    this._scooterData.avg_speed = d(value[9]) / 1000;
    this.parseSpeed(value[10]);
    this._scooterData.speed = d(value[10]) / 1000;
    this._scooterData.battery_life = d(value[11]);
    this.parseLock(value[13]);
    this._scooterData.warning_oce = d(value[14]);
    this._scooterData.error_code = d(value[15]);
  }

  private parseSpeed(data: string) {
    const value = this.helper.hexToInt(data) / 1000;
    const speed = Math.round(value * 10) / 10;
    this._scooterData.speed = speed;
    if (speed > this._scooterData.speed) this._scooterData.max_speed = speed;
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
    if (data.includes('2')) this._scooterData.lock_mode = true;
    else this._scooterData.lock_mode = false;
  }

  parseRecovery(data: string) {
    if (data.includes('1')) this._scooterData.recovery_mode = 1;
    else if (data.includes('2')) this._scooterData.recovery_mode = 2;
    else  this._scooterData.recovery_mode = 0;

  }

}
