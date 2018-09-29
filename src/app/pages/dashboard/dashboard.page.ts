import { ResponseService } from './../../service/response';
import { CommandsService } from './../../service/commands';
import { HelperService } from './../../service/helper';
import { BLE } from '@ionic-native/ble/ngx';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Scooter } from '../../models/scooter';
import { map, pairwise } from 'rxjs/operators';

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  scooterData: Scooter;

  private deviceInfo: any;
  private intervals: any[] = [];

  constructor(
    private bluetooth: BLE,
    private route: ActivatedRoute,
    private helper: HelperService,
    private commands: CommandsService,
    private cdr: ChangeDetectorRef,
    private response: ResponseService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.connectToDevice(id);
  }

  connectToDevice(id: string) {
    this.bluetooth.connect(id).subscribe(res =>  {
      console.log('Conected device!');
      this.deviceInfo = res;
      this.scooterData = this.response.scooterData;

      this.bluetooth.startNotification(this.deviceInfo.id, this.commands.serviceUUID, this.commands.CHAR_READ)
      .pipe(map(e => this.helper.bytesToHex(e)))
      .subscribe(data => {
        console.log(data);
        this.response.hendleResponse(data);
        this.cdr.detectChanges();
      });

      /*this.intervals.push(setInterval(() => this.request(this.commands.getSpeed()), 500));
      this.request(this.commands.getBattery());
      this.request(this.commands.getAmp());
      this.request(this.commands.getDistance());*/
      // this.request(this.commands.getVoltage());
      // this.request(this.commands.getMasterInfo());
      this.request(this.commands.getMasterBattery());
    }, err => {
      console.log('Device connection error!');
    });
  }

  request(data: any) {
    const value = this.helper.hexStringToByte(data);
    this.bluetooth.write(this.deviceInfo.id, this.commands.serviceUUID, this.commands.CHAR_WRITE, value).then(res => {
      // console.log(data);
    }).catch(err => {
      console.log(err);
    });
  }

  ionViewDidLeave() {
    this.bluetooth.disconnect(this.deviceInfo.id).then(() => console.log('Disconnected!'));
    clearInterval(this.intervals[0]);
  }

}
