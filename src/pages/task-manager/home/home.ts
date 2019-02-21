import { Task } from './../main/task';
import { Storage } from '@ionic/storage';
import { SetingsPage } from './../setings/setings';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  constructor(public navCtrl: NavController,  private storage: Storage) {
  
    this.storage.clear();
}
   goToAbout(){
    this.navCtrl.push(SetingsPage);
  }


  openSocial(network: string) {
    console.log('Share in ' + network);
  }
}