import { ResponseService } from './../../service/response';
import { CommandsService } from './../../service/commands';
import { HelperService } from './../../service/helper';
import { BLE } from '@ionic-native/ble/ngx';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Scooter } from '../../models/scooter';
import { map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

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
    private response: ResponseService,
    private navCtrl: NavController
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
      .pipe(map(e => this.helper.byteToHex(e)))
      .subscribe(data => {
        this.response.hendleResponse(data);
        this.cdr.detectChanges();
      });

      // this.intervals.push(setInterval(() => this.sendRequest(this.commands.getMasterInfo()), 500));

      /*this.sendRequest(this.commands.getSerial());
      this.sendRequest(this.commands.getFirmware());
      this.sendRequest(this.commands.getTravel());
      this.sendRequest(this.commands.getRemainingDistance());
      this.sendRequest(this.commands.getMasterInfo());*/

      this.sendRequest(this.commands.getMasterBattery());
      this.sendRequest(this.commands.getBatteryInfo());
      this.sendRequest(this.commands.getCycleCharge());
      this.sendRequest(this.commands.getVoltageByCell());
      this.sendRequest(this.commands.getBatteryHealth());
      this.sendRequest(this.commands.getBatteryDate());

      this.sendRequest(this.commands.getCurise());
      this.sendRequest(this.commands.getLight());
      this.sendRequest(this.commands.getLock());
      this.sendRequest(this.commands.getRecovery());
    }, err => {
      console.log('Device connection error!');
      this.navCtrl.goBack();
    });
  }

  sendRequest(data: any) {
    const value = this.helper.hexToByte(data);
    this.bluetooth.write(this.deviceInfo.id, this.commands.serviceUUID, this.commands.CHAR_WRITE, value).then(res => {
      // console.log(data);
    }).catch(err => {
      console.warn(err);
    });
  }

  ionViewDidLeave() {
    if (this.deviceInfo && this.bluetooth.isConnected(this.deviceInfo.id)) {
      this.bluetooth.disconnect(this.deviceInfo.id).then(() => console.log('Device disconnected!'));
    }
    clearInterval(this.intervals[0]);
  }

}
