import { CommandsService } from './../../service/commands';
import { HelperService } from './../../service/helper';
import { BLE } from '@ionic-native/ble/ngx';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Scooter } from '../../models/scooter';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  deviceInfo: any;
  deviceStats: Scooter = {};
  intervals: any[] = [];

  constructor(
    private bluetooth: BLE,
    private route: ActivatedRoute,
    private helper: HelperService,
    private commands: CommandsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.connectToDevice(id);
  }

  connectToDevice(id: string) {
    this.bluetooth.connect(id).subscribe(res =>  {
      console.log('Conected device!');
      this.deviceInfo = res;

      this.bluetooth.startNotification(this.deviceInfo.id, this.commands.serviceUUID, this.commands.CHAR_READ)
      .pipe(map(e => this.helper.bytesToHex(e)))
      .subscribe(data => {
        const result = this.helper.reverseHex(data.slice(12, 16));
        const speed = this.helper.hexToInt(result) / 1000;
        this.deviceStats.speed = Math.round(speed * 10) / 10;

        console.log(result, speed);
        this.cdr.detectChanges();
      });

      this.intervals.push(setInterval(() => this.requestSpeed(), 500));
    }, err => {
      console.log('Device connection error!');
    });
  }

  requestSpeed() {
    const value = this.helper.hexStringToByte(this.commands.getSpeed());
    this.bluetooth.write(this.deviceInfo.id, this.commands.serviceUUID, this.commands.CHAR_WRITE, value).then(data => {
      // console.log(data);
    }).catch(err => {
      console.log(err);
    });
  }

  ngOnDestroy() {
    this.bluetooth.disconnect(this.deviceInfo.id);
    clearInterval(this.intervals[0]);
  }

}
