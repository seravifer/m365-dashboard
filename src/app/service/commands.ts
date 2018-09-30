import { Message, Command } from '../models/message';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommandsService {

  // Start -> 10, 1a, 67, 17
  // Runing -> 3a,25,b0
  // Info -> 7c, 7d, 7b, 76

  serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
  CHAR_WRITE = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // characteristic WRITE
  CHAR_READ = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';  // characteristic READ

  constructor() { }

  getSerial() {
    return new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.READ)
      .setPosition(0x10)
      .setPayload(0x02)
      .build();
  }

  getFirmware() {
    return new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.READ)
      .setPosition(0x1A)
      .setPayload(0x02)
      .build();
  }

  getBMS() {
    return new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.READ)
      .setPosition(0x67)
      .setPayload(0x04)
      .build();
  }

  getMasterInfo() {
    return new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.READ)
      .setPosition(0xb0)
      .setPayload(0x20)
      .build();
  }

  getDistance() {
    return new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.READ)
      .setPosition(0xB9)
      .setPayload(0x02)
      .build();
  }

  getRemainingDistance() {
    return new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.READ)
      .setPosition(0x25)
      .setPayload(0x04)
      .build();
  }

  getTravel() {
    return new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.READ)
      .setPosition(0x3a)
      .setPayload(0x04)
      .build();
  }

  // Battery - - - - - - - - - - - - - - - - -

  getMasterBattery() {
    return new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.READ)
      .setPosition(0x31)
      .setPayload(0x02)
      .build();
  }

  getBatteryInfo() { // + Design capacity
    return new Message()
      .setDirection(Command.MASTER_TO_BATTERY)
      .setRW(Command.READ)
      .setPosition(0x10)
      .setPayload(0x12)
      .build();
  }

  getCycleCharge() {
    return new Message()
      .setDirection(Command.MASTER_TO_BATTERY)
      .setRW(Command.READ)
      .setPosition(0x1b)
      .setPayload(0x04)
      .build();
  }

  getVoltageByCell() {
    return new Message()
      .setDirection(Command.MASTER_TO_BATTERY)
      .setRW(Command.READ)
      .setPosition(0x40)
      .setPayload(0x1e)
      .build();
  }

  // Settings - - - - - - - - - - - - - - - - -

  getCurise() {
    return new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.READ)
      .setPosition(0x7C)
      .setPayload(0x02)
      .build();
  }

  setCruise(value: boolean) {
    const msg = new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.WRITE)
      .setPosition(0x7C);
    if (value) msg.setPayload(0x0001).build();
    else msg.setPayload(0x0000).build();
  }

  getLight() {
    return new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.READ)
      .setPosition(0x7D)
      .setPayload(0x02)
      .build();
  }

  setLight(value: boolean) {
    const msg = new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.WRITE)
      .setPosition(0x7D);
    if (value) msg.setPayload(0x0002).build();
    else msg.setPayload(0x0000).build();
  }

  getLock() {
    return new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.READ)
      .setPosition(0xB2)
      .setPayload(0x02)
      .build();
  }

  setLock(value: boolean) {
    if (value) {
      return new Message()
        .setDirection(Command.MASTER_TO_SCOOTER)
        .setRW(Command.WRITE)
        .setPosition(0x70)
        .setPayload(0x0001)
        .build();
    } else {
      return new Message()
        .setDirection(Command.MASTER_TO_SCOOTER)
        .setRW(Command.WRITE)
        .setPosition(0x71)
        .setPayload(0x0001)
        .build();
    }
  }

  getRecovery() {
    return new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.READ)
      .setPosition(0x7B)
      .setPayload(0x02)
      .build();
  }

  setRecovery(mode: 0 | 1 | 2) {
    const msg = new Message()
      .setDirection(Command.MASTER_TO_SCOOTER)
      .setRW(Command.WRITE)
      .setPosition(0x7B);
    if (mode === 0) msg.setPayload(0x0000);
    else if (mode === 1) msg.setPayload(0x0001);
    else msg.setPayload(0x0002);
    return msg.build();
  }

}
