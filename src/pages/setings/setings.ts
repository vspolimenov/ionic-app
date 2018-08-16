import { MorePage } from './../more/more';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-setings',
  templateUrl: 'setings.html'
})
export class SetingsPage {
  name:String;
  age:number;
  constructor(public navCtrl: NavController, private storage: Storage) {
    this.storage.get('name').then((val) => {
      this.name = val;
    });
  }
  goToNext(){
    this.storage.set('name', this.name);
    this.storage.set('age', this.age);
    this.navCtrl.push(MorePage);
    
	}
}
