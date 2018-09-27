import { CommandsService } from './../../service/commands';
import { BLE } from '@ionic-native/ble/ngx';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  devices: any[] = [];

  constructor(
    private router: Router,
    private bluetooth: BLE
  ) {}

  ngOnInit() {
    this.onScan();
  }

  onScan() {
    console.log('Scaning...');
    this.bluetooth.scan([], 60).subscribe((res: any) => {
      this.devices.push(res);
      console.log(res);
    }, err => {
      console.warn('Bluetooth not found!');
    });
  }

  onSelectDevice(id: string) {
    this.bluetooth.stopScan();
    this.router.navigateByUrl(`/dashboard/${id}`);
  }

}
