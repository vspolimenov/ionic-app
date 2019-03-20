import { Services } from './../services';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DatePipe } from '@angular/common';

import { Component } from '@angular/core';
import { NavController, DateTime, Platform, AlertController, FabContainer } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html'
})
export class Transactions {

  currency:string;
  transactionsLength:number;
  transactions: Array<string> = [];
  constructor(public navCtrl: NavController, private storage: Storage) {

    this.setProgram();
  }
  setProgram() {

    this.storage.get('transactionSeq').then((val: number) => {

      this.transactionsLength = 0;
      while (val > 0) {
        this.storage.get(val - 1 + "transaction").then((tr) => {
          if(tr) {
          console.log(tr);
          this.transactions.push(tr );
          this.transactionsLength++;
         
          }
        });
      
        val -= 1;
      }
});}
 
  goToNext(fab: FabContainer){
    fab.close();

    this.navCtrl.pop();

  }
 
}
