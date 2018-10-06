import { ResponseService } from './../../service/response';
import { CommandsService } from './../../service/commands';
import { HelperService } from './../../service/helper';
import { BLE } from '@ionic-native/ble/ngx';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Scooter } from '../../models/scooter';
import { map } from 'rxjs/operators';
import { Slides } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  slideOptions = {
    initialSlide: 1,
    autoplay: false
  };

  scooterData: Scooter = {};

  private deviceId: any;
  private intervals: any[] = [];

  Math: Math = Math;

  @ViewChild('slides') slides: Slides;

  constructor(
    private bluetooth: BLE,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private helper: HelperService,
    private commands: CommandsService,
    private cdr: ChangeDetectorRef,
    private response: ResponseService
  ) { }

  ngOnInit() {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    this.deviceId = id;
    // this.bluetooth.autoConnect(id, null, null);
    this.initConnection();
  }

  initConnection() {
    this.scooterData = this.response.scooterData;

    this.bluetooth.startNotification(this.deviceId, this.commands.serviceUUID, this.commands.CHAR_READ)
      .pipe(map(e => this.helper.byteToHex(e)))
      .subscribe(data => {
        this.response.hendleResponse(data);
        this.cdr.detectChanges();
      });

    this.sendRequest(this.commands.getSerial());
    this.sendRequest(this.commands.getFirmware());

    this.sendRequest(this.commands.getCurise());
    this.sendRequest(this.commands.getLight());
    this.sendRequest(this.commands.getLock());
    this.sendRequest(this.commands.getRecovery());

    this.sendRequest(this.commands.getBatteryInfo());
    this.sendRequest(this.commands.getCycleCharge());
    this.sendRequest(this.commands.getVoltageByCell());
    this.sendRequest(this.commands.getBatteryHealth());
    this.sendRequest(this.commands.getBatteryDate());

    this.intervals.push(setInterval(() => this.sendRequest(this.commands.getRemainingDistance()), 10000));
    this.intervals.push(setInterval(() => this.sendRequest(this.commands.getMasterInfo()), 500));
    this.intervals.push(setInterval(() => this.sendRequest(this.commands.getMasterBattery()), 300));
  }

  sendRequest(data: any) {
    const value = this.helper.hexToByte(data);
    this.bluetooth.write(this.deviceId, this.commands.serviceUUID, this.commands.CHAR_WRITE, value).then(res => {
      // console.log(data);
    }).catch(err => {
      console.error(err);
    });
  }

  getDecimal(n: number) {
    const number = String(n).split('.');
    return number[1] ? +number[1] : 0;
  }

  formatSpeed(n: number) {
    const value = Math.abs(Math.trunc(n)).toString();
    return value.length === 2 ? value : `0${value}`;
  }

  disconnect() {
    this.intervals.forEach((e) => clearInterval(e));
    if (this.bluetooth.isConnected(this.deviceId)) {
      this.bluetooth.disconnect(this.deviceId).then(() => console.log('Device disconnected!'));
    }
    this.router.navigate(['home']);
  }

  formatTime(sec: number) {
    return moment.utc(sec * 1000).format('mm:ss');
  }

  ionViewDidLeave() {
    this.disconnect();
  }

}
