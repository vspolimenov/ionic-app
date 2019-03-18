import { MainFinancePage } from './../main/main-finance';
import { MoneyCostOrIncome } from './../money-cost-income';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, Platform, AlertController, FabContainer } from 'ionic-angular';

@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html'
})
export class EditIncomePage {
  income:MoneyCostOrIncome;
  incomeSeq:number;
  isFixed:boolean;
  constructor(public navCtrl: NavController,  private storage: Storage,  public localNotifications: LocalNotifications,
    public platform: Platform,
    public alertCtrl: AlertController) {
    this.income = new MoneyCostOrIncome();
    this.storage.get('editedIncome').then((val: number) => {
      this.incomeSeq = val;
  
      this.storage.get(val + "income").then((income: MoneyCostOrIncome) => {
        console.log("ПАРАМПАМПАМ" + val);
        this.income.name = income.name;
        this.income.description = income.description;
        this.income.date = income.date;
        this.income.showInfo = income.showInfo;
        this.income.type = income.type;
        this.income.quantity = income.quantity;
        this.income.category = income.category;
        this.income.target = income.target;
        this.income.incomeId = income.incomeId;
        this.income.value = income.value;
      });
    });

  }

  deleteTask(fab: FabContainer){
    fab.close();
this.storage.remove(this.incomeSeq + "task");
    this.navCtrl.push(MainFinancePage); 
  }
 
  goToNext(fab: FabContainer){
    fab.close();

   this.income.incomeId = this.incomeSeq;
    this.storage.set(this.incomeSeq + "income",this.income);
    this.navCtrl.push(MainFinancePage);    
  }
  goBack(fab: FabContainer){
    fab.close();
    this.navCtrl.push(MainFinancePage);    
	}
}
