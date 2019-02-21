import { EditIncomePage } from './../edit-task/edit-task';
import { Add } from './../task-add/add';
import { MainPage } from './../../task-manager/main/main';
import { MoneyCostOrIncome } from './../money-cost-income';
import { HomePage } from './../../task-manager/home/home';
import { FabContainer, NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NewMoneyCostOrIncomePage } from '../new-task/new-money-cost-income';

@Component({
  selector: 'page-main-finance',
  templateUrl: 'main-finance.html'
})
export class MainFinancePage {
  amount:number;
  incomesLength:number;
  incomes: Array<MoneyCostOrIncome> = [];
  lastMonthIncomes:number;
  lastMonthCosts:number;
  currency:string;
  public apps: String;
  isShownAmount:boolean;
  foodSum:number;
  ngOnInit() {
    this.apps = "amount";
  }
  constructor(public navCtrl: NavController, private storage: Storage){
    this.lastMonthCosts = 0;
    this.lastMonthIncomes = 0;
    this.isShownAmount = false;
 
    this.storage.get('currency').then((val) => {
      
      this.currency = val;    
      });

    this.storage.get('incomeSeq').then((val: number) => {
      console.log(val);
      this.incomesLength = 0;
      this.foodSum = 0;
      while (val > 0) {

        this.storage.get(val - 1 + "income").then((income) => {
          console.log(income);
          this.storage.get('amount').then((val) => {
      
            this.amount = val;    
            });
          if(income && new Date(income.date).toDateString() == new Date().toDateString()){

            if(income.isIncome && new Date(income.date).getMonth() == new Date().getMonth()) {
              this.lastMonthIncomes += +income.value;
            } else if (!income.isIncome && new Date(income.date).getMonth() == new Date().getMonth()){
              this.lastMonthCosts += +income.value;
            }
          this.incomes.push(income);
          this.incomesLength++;
          
         } else if(income && income.type == "Everyday" || 
         (income && income.type == "Month" && new Date(income.date).getMonth() == new Date().getMonth() - 1 && 
         new Date(income.date).getDate() == new Date().getDate())) {
          this.incomes.push(income);
          this.incomesLength++;
         } });
         val -= 1;
      }
    });
  }
    add(income:MoneyCostOrIncome) {
      this.storage.set('editedIncome', income.incomeId);
      this.navCtrl.push(Add);
    }
    addCategorySum(income:MoneyCostOrIncome){
      if(income.type == "Food") {
        console.log("income value " + income.value);
        this.foodSum += income.value;
      }
    }
    
  goToNext(fab?: FabContainer){
    fab.close();
    this.navCtrl.push(HomePage);

  }
  goToNewTask(fab?: FabContainer){
    fab.close();
    this.navCtrl.push(NewMoneyCostOrIncomePage);
  }
  goToTaskManager(fab?: FabContainer){
    fab.close();
    this.navCtrl.push(MainPage);
  }
  refresh() {
    location.reload();

  }
  showAmount(){
    if (this.isShownAmount) {
      this.isShownAmount = false;
    } else {
      this.storage.get('amount').then((val) => {
      
        this.amount = val;    
        });
      this.isShownAmount = true;
    }
  }

  showInfoStateChange(task: MoneyCostOrIncome) {
    if (task.showInfo) {
      task.showInfo = false;
    } else {
      task.showInfo = true;
    }
  }

  changeIncome(income:MoneyCostOrIncome) {
    this.storage.set('editedTask', income.incomeId);
    this.navCtrl.push(EditIncomePage);
  }
  public changeState(task: MoneyCostOrIncome) {
  }
}
