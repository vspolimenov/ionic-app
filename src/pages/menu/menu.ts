import { MainFinancePage } from './../finance-manager/main/main-finance';

import { HomePage } from './../task-manager/home/home';
import { MainPage } from './../task-manager/main/main';
import { Task } from './../task-manager/main/task';
import { Storage } from '@ionic/storage';
import { SetingsPage } from './../task-manager/setings/setings';
import { Component } from '@angular/core';
import { NavController, FabContainer } from 'ionic-angular';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {

name:string;
  constructor(public navCtrl: NavController,  private storage: Storage) {
    this.storage.get('name').then((val) => {
      if(!val) {
        this.navCtrl.push(HomePage);
      } else {
      this.name = val;
      }
    });
}
   goToAbout(){
    this.navCtrl.push(SetingsPage);
  }
  goToFinance(){
    this.navCtrl.push(MainFinancePage)
  }
  goToMainPage(){
   this.navCtrl.push(MainPage);
  }

  openSocial(network: string) {
    console.log('Share in ' + network);
  }
}