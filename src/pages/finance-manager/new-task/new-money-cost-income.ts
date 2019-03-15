import { MainFinancePage } from './../main/main-finance';
import { MoneyCostOrIncome } from './../money-cost-income';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, Platform, AlertController, FabContainer } from 'ionic-angular';

@Component({
  selector: 'page-new-money-cost-income',
  templateUrl: 'new-money-cost-income.html'
})
export class NewMoneyCostOrIncomePage {
  income:MoneyCostOrIncome;
  incomeSeq:number;
  amount:number;
  error:string;

  constructor(public navCtrl: NavController,  private storage: Storage,  public localNotifications: LocalNotifications,
    public platform: Platform,
    public alertCtrl: AlertController) {
    this.income = new MoneyCostOrIncome;
    this.storage.get('incomeSeq').then((val) => {
      this.storage.set('incomeSeq',val+1);
      this.incomeSeq = val;
      this.income.incomeId = val;
   });
  }

  goToNext(){
  if(this.income.name &&  this.income.name != "" && this.income.target) {
  var date = new Date(this.income.date);
  console.log(date);
  // let alert = this.alertCtrl.create({
  //   title: 'New Task!',
  //   subTitle: 'to' +date,
  //   buttons: ['OK']
  // });
  if(!this.income.date) {
    this.income.date = new Date().toDateString();
  }
  if(!this.income.isIncome) {
    this.income.isIncome = false;
  }else {
    this.income.isIncome = true;
  }
 // alert.present();
  this.income.value=0;
    this.storage.set(this.incomeSeq + "income",this.income); 
    this.navCtrl.push(MainFinancePage);
} else {
 this.error = "You must add name and target price to this income";
}
  }
  goBack(fab: FabContainer){
    fab.close();
    this.navCtrl.push(MainFinancePage);    
	}
}
