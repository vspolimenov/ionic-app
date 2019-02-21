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
  constructor(public navCtrl: NavController, private storage: Storage, public localNotifications: LocalNotifications,
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
    if (this.income.value + +this.valueToAdd <= this.income.target) {
      this.income.value += +this.valueToAdd;
      this.storage.set(this.incomeSeq + "income", this.income);
      this.storage.get('amount').then((val) => {
        if (this.income.isIncome) {
          this.storage.set('amount', val + this.income.value);
        } else {
          this.storage.set('amount', val - this.income.value);
        }
        this.amount = val;
      });
      this.navCtrl.push(MainFinancePage);
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
            this.income.value += +this.valueToAdd;
            this.storage.set(this.incomeSeq + "income", this.income);
            this.storage.get('amount').then((val) => {
              if (this.income.isIncome) {
                this.storage.set('amount', val + this.valueToAdd);
              } else {
                this.storage.set('amount', val - this.valueToAdd);
              }
              this.amount = val;
            });
            this.storage.set(this.incomeSeq + "income", this.income);
            this.storage.get('amount').then((val) => {
              if (this.income.isIncome) {
                this.storage.set('amount', val + this.valueToAdd);
              } else {
                this.storage.set('amount', val - this.valueToAdd);
              }
              this.amount = val;
            });
            this.navCtrl.pop();
          }
        }
        ]
      });
      alert.present();
    }

  }
  goBack(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(MainFinancePage);
  }
}