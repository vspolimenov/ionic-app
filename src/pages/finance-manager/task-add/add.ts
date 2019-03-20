import { DatePipe } from '@angular/common';
import { MainPage } from './../../task-manager/main/main';
import { MenuPage } from './../../menu/menu';
import { MainFinancePage } from './../main/main-finance';
import { MoneyCostOrIncome } from './../money-cost-income';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, Platform, AlertController, FabContainer } from 'ionic-angular';

@Component({
  selector: 'page-add',
  templateUrl: 'add.html'
})
export class Add {
  income: MoneyCostOrIncome;
  incomeSeq: number;
  amount: number;
  valueToAdd: number;
  constructor(public navCtrl: NavController, private storage: Storage, public localNotifications: LocalNotifications,    private datePipe: DatePipe,
    public platform: Platform,
    public alertCtrl: AlertController) {
    this.storage.get('editedIncome').then((val: number) => {
      this.incomeSeq = val;
      this.storage.get(val + "income").then((income: MoneyCostOrIncome) => {
        this.income = income;
      });
    });
  }

  goToNext() {
    this.storage.get('currency').then((cur) => { 
 
    this.storage.get('transactionSeq').then((tr: number) => {
    if (this.income.value + +this.valueToAdd <= this.income.target) {
      this.income.value += +this.valueToAdd;
      this.storage.set(this.incomeSeq + "income", this.income);
      this.storage.get('amount').then((val) => {

        this.storage.get('lastMonthIncomes').then((income) => {

          this.storage.get('lastMonthCosts').then((cost) => {
        if (this.income.isIncome) {
          console.log( +income + +this.valueToAdd);
          this.storage.set('amount', +val + +this.valueToAdd);
            this.storage.set('lastMonthIncomes', +income + +this.valueToAdd);
            this.storage.set(tr + "transaction", this.income.name + ": " + +this.valueToAdd + " " + cur+ ". " + this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
            this.storage.set('transactionSeq', tr +1);
        } else {
          this.storage.set('amount', +val - +this.valueToAdd);
            this.storage.set('lastMonthCosts', +cost + +this.valueToAdd);
            this.storage.set(tr + "transaction", this.income.name + ": -" + +this.valueToAdd + " " + cur+ ". " +  this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
            this.storage.set('transactionSeq', tr +1);
        }
    
        this.amount = val;
        this.navCtrl.popToRoot();
      });
    });
  });
    } else {
      let alert = this.alertCtrl.create({
        title: 'This sum is more than expected to this item',
        subTitle: 'Are you sure you want to add it?',
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.income.value += +this.valueToAdd *  this.income.quantity;
            this.storage.set(this.incomeSeq + "income", this.income);
            this.storage.get('amount').then((val) => {
              if (this.income.isIncome) {
                this.storage.set('amount', +val + +this.valueToAdd *  this.income.quantity);
                this.storage.get('lastMonthIncomes').then((value) => {
                  this.storage.set('lastMonthIncomes', +value + +this.valueToAdd *  this.income.quantity);
                  this.storage.set(tr + "transaction", this.income.name + ": " + +this.valueToAdd + " " + cur+ ". " + new Date());
                  this.storage.set('transactionSeq', tr +1);
                });
              } else {
                this.storage.set('amount', +val - +this.valueToAdd *  this.income.quantity);
                this.storage.get('lastMonthCosts').then((value) => {
                  this.storage.set('lastMonthCosts', +value + +this.valueToAdd *  this.income.quantity);
                  this.storage.set(tr + "transaction", this.income.name + ": -" + +this.valueToAdd + " " + cur+ ". " + new Date());
                  this.storage.set('transactionSeq', tr +1);
                });
              }
             
              this.amount = val;
            });
            this.navCtrl.popToRoot();
          }
        }
        ]
      });

      this.navCtrl.popToRoot();
      alert.present();
    }
  });});
  }
  goBack(fab: FabContainer) {
    fab.close();
    this.navCtrl.pop();
  }
}
