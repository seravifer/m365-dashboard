import { Scooter } from '../../models/scooter';
import { Component, ViewChild } from '@angular/core';
import { Slides } from '@ionic/angular';

@Component({
  selector: 'app-mock',
  templateUrl: './mock.page.html',
  styleUrls: ['./mock.page.scss'],
})
export class MockPage {

  scooterData: Scooter = {
    serial_number: 'YTGK7HVGH68BYTV',
    firmware_version: '1.4.2',
    bms_code: '1.15',

    error_code: 0,
    warning_oce: 0,

    speed: 2.8,
    avg_speed: 20.3,
    max_speed: 27,

    distance_travelled: 2.34,
    distance_remaining: 20.5,
    total_distance: 145.98,
    uptime: 3400,
    ridding_time: 3400, // seconds

    motor_temperature: 28,

    recovery_mode: 1,
    cruise_mode: false,
    light_mode: true,
    lock_mode: false,

    battery_life: 45,
    battery_serial: '75680IYK/B7',
    battery_date: '2018-06-20',
    battery_design_capacity: 7800,
    battery_remaining_capacity: 4500,
    battery_health: 98,
    battery_temp1: 30,
    battery_temp2: 30,
    battery_ampere: 5.56,
    battery_voltage: 30.6,
    battery_power: 250,
    battery_max_power: 350,
    battery_min_power: 120,
    battery_charges: 5,
    battery_full_charges: 2,
    voltage_cells: [3.5, 3.6, 3.45, 3.23]
  };

  slideOptions = {
    initialSlide: 1,
    autoplay: false
  };


  Math: Math = Math;

  @ViewChild('slides') slides: Slides;

  constructor() { }

  getDecimal(n: number) {
    const number = String(n).split('.');
    return number[1] ? +number[1] : 0;
  }

  formatSpeed(n: number) {
    const value = Math.trunc(n).toString();
    return value.length === 2 ? value : `0${value}`;
  }

}
