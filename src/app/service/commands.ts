import { Request, Command } from './../models/request';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommandsService {

  serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
  CHAR_WRITE = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // characteristic WRITE
  CHAR_READ = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';  // characteristic READ

  constructor() { }

  getBattery() {
    return new Request()
      .setDirection(Command.MASTER_TO_BATTERY)
      .setRW(Command.READ)
      .setPosition(0x31)
      .setPayload(0x0a)
      .build();
  }

  getInfo() {
    return new Request()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.READ)
      .setPosition(0xb0)
      .setPayload(0x20)
      .build();
  }

  getSpeed() {
    return new Request()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.READ)
      .setPosition(0xb5)
      .setPayload(0x02)
      .build();
  }

}
