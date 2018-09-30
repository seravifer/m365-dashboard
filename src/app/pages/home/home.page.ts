import { BLE } from '@ionic-native/ble/ngx';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  devices: any[] = [];

  constructor(
    private router: Router,
    private bluetooth: BLE,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.onScan();
  }

  onScan() {
    console.log('Scaning...');
    this.devices = [];
    this.bluetooth.scan([], 30).subscribe((res: any) => {
      console.log(res);
      if (res.name) {
        this.devices.push(res);
        this.cdr.detectChanges();
      }
    }, err => {
      console.warn('Bluetooth not found!');
    });
  }

  onSelectDevice(id: string) {
    this.bluetooth.stopScan();
    this.router.navigate(['dashboard', id]);
  }

  ngOnDestroy() {
    this.bluetooth.stopScan();
  }

}
