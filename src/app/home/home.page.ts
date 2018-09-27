import { BLE } from '@ionic-native/ble/ngx';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  devices: any[];

  constructor(
    private bluetooth: BLE
  ) {}

  ngOnInit() {
    this.bluetooth.scan([], 60).subscribe(res => {
      this.devices.push(res);
      console.log(res);
    }, err => {
      console.warn('Bluetooth not found!');
    })
  }

  onSelectDevice(id: string) {
    this.bluetooth.connect(id).subscribe(res =>  {
      console.log('Conected device!');
    }, err => {
      console.log('Device connection error!');
    })
  }

}
