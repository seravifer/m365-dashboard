import { BLE } from '@ionic-native/ble/ngx';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  deviceInfo: any;

  constructor(
    private bluetooth: BLE,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.bluetooth.connect(id).subscribe(res =>  {
      console.log('Conected device!');
      console.log(res);
      this.deviceInfo = res;
    }, err => {
      console.log('Device connection error!');
    })
  }

}
