import { Command } from './../models/message';
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
    if (data.length === 0) return;

    const fromType = data.slice(6, 8);
    let dataType = data.slice(10, 12);
    let lengthContent = (d(data.slice(4, 6)) - 2) * 2;
    let dataContent = data.slice(12, 12 + lengthContent);
    dataContent = this.helper.parseHex(dataContent);

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
    console.log(fromType, dataType, lengthContent, dataContent);

    this.selectParser(fromType, dataType, dataContent);
  }

  selectParser(fromType: string, dataType: string, dataContent: string) {
    if (+('0x' + fromType) === Command.SCOOTER_TO_MASTER.valueOf()) {
      switch (dataType) {
        case '10': this.parseSerial(dataContent); break;
        case '1a': this.parseFirmware(dataContent); break;

        case 'b0': this.parseMasterInfo(dataContent); break;
        case '3a': this.parseTravell(dataContent); break;
        case '25': this.parseRemainigDistance(dataContent); break;

        case '7b': this.parseRecovery(dataContent); break;
        case '7c': this.parseCruise(dataContent); break;
        case '7d': this.parseLight(dataContent); break;
        case 'b2': this.parseLock(dataContent); break;
        default: break;
      }
    } else {
      switch (dataType) {
        case '31': this.parseMasterBattery(dataContent); break;
        case '20': this.parseBatteryDate(dataContent); break;
        case '3b': this.parseBatteryHealth(dataContent); break;
        case '10': this.parseBatteryInfo(dataContent); break;
        case '1b': this.parseCycleCharge(dataContent); break;
        case '40': this.parseVoltageByCell(dataContent); break;
        default: break;
      }
    }
  }

  parseSerial(data: string) {
    this._scooterData.serial_number = this.helper.hexToAscii(data);
  }

  parseFirmware(data: string) {
    this._scooterData.firmware_version = data.slice(-3).split('').join('.');
  }

  parseMasterInfo(data: string) {
    const value = data.match(/.{1,4}/g);
    this._scooterData.motor_temperature = d(value[4]) / 10;
    this._scooterData.distance_travelled = d(value[6]);
    this._scooterData.total_distance = d(value[7] + value[8]) / 1000;
    this._scooterData.avg_speed = d(value[9]) / 1000;
    this.parseSpeed(value[10]);
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

  parseTravell(data: string) {
    const value = data.match(/.{1,4}/g);
    this._scooterData.distance_travelled = d(value[0]);
    this._scooterData.ridding_time = d(value[1]);
  }

  parseRemainigDistance(data: string) {
    this._scooterData.distance_remaining = d(data) / 100;
  }

  // Battery - - - - - - - - - - - - - - - - -

  parseMasterBattery(data: string) {
    const value = data.match(/.{1,4}/g);
    this._scooterData.battery_temp1 = d(value[0].slice(0, 2)) - 20;
    this._scooterData.battery_temp2 = d(value[0].slice(2, 4)) - 20;
    this._scooterData.battery_voltage = d(value[1]) / 100;
    this._scooterData.battery_ampere = d(value[2]) / 100;
    this.parsePower();
    this._scooterData.battery_life = d(value[3]);
    this._scooterData.battery_remaining_capacity = d(value[4]);
  }

  private parsePower() {
    const value = this._scooterData.battery_voltage * this._scooterData.battery_ampere;
    this._scooterData.battery_power = Math.round(value * 10) / 10;
  }

  parseBatteryDate(data: string) {
    const value = parseInt(data, 16).toString(2);
    const year = parseInt(value.slice(0, 5), 2);
    const month = parseInt(value.slice(5, 9), 2);
    const day = parseInt(value.slice(9), 2);
    this._scooterData.battery_date = `${year}-${month}-${day}`;
  }

  parseBatteryHealth(data: string) {
    this._scooterData.battery_health = d(data);
  }

  parseBatteryInfo(data: string) {
    this._scooterData.battery_design_capacity = d(data.slice(0, 4));
    this._scooterData.bms_code = data.slice(5, 8).split('').join('.');
    this._scooterData.battery_serial = this.helper.hexToAscii(data.substring(8));
  }

  parseCycleCharge(data: string) {
    const value = data.match(/.{1,4}/g);
    this._scooterData.battery_charges = d(value[1]);
    this._scooterData.battery_full_charges = d(value[0]);
  }

  parseVoltageByCell(data: string) {
    const value = data.match(/.{1,4}/g);
    this._scooterData.voltage_cells = value.filter(e => e !== '0000').map(e => d(e) / 1000).reverse();
  }

  // Settings - - - - - - - - - - - - - - - - -

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
    else this._scooterData.recovery_mode = 0;
  }

}
