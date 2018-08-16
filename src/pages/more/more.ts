import { MainPage } from './../main/main';
import { Component } from '@angular/core';
import { NavController, DateTime } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-more',
  templateUrl: 'more.html'
})
export class MorePage {
   sleepHour:string;
   wakeupHour:string;
  constructor(public navCtrl: NavController, private storage: Storage) {
  }
  data = {
   alarm: false
  };
  goToNext(){
    console.log(this.sleepHour);
  this.storage.set('sleepHour',this.sleepHour);
   this.storage.set('wakeupHour',this.wakeupHour);
    this.navCtrl.push(MainPage);
    
	}
}
//<ion-datetime displayFormat="HH:mm" [(ngModel)]="parisTime"></ion-datetime>