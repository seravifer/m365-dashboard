import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Slides } from '@ionic/angular';

@Component({
  selector: 'app-mock',
  templateUrl: './mock.page.html',
  styleUrls: ['./mock.page.scss'],
})
export class MockPage {

  slideOptions = {
    initialSlide: 1
  };

  @ViewChild('slides') slides: Slides;

  constructor() { }

}
