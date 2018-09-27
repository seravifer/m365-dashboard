import { Request, Commands } from './../models/request';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommandsService {

  constructor() { }

  getBattery() {
    return new Request()
      .setDirection(Commands.MASTER_TO_BATTERY)
      .setRW(Commands.READ)
      .setPosition(0x31)
      .setPayload(0x0a)
      .build();
  }
}