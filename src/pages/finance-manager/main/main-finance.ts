import { MenuPage } from './../../menu/menu';
import { FinanceProgram } from './../finance-program/finance-program';
import { EditIncomePage } from './../edit-task/edit-task';
import { Add } from './../task-add/add';
import { MainPage } from './../../task-manager/main/main';
import { MoneyCostOrIncome } from './../money-cost-income';
import { HomePage } from './../../task-manager/home/home';
import { FabContainer, NavController } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NewMoneyCostOrIncomePage } from '../new-task/new-money-cost-income';
import { Chart } from 'chart.js';

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
  
  @ViewChild('barCanvas') barCanvas;

  barChart: any;
  ngOnInit() {
    this.apps = "amount";
  }
  constructor(public navCtrl: NavController, private storage: Storage){
    this.lastMonthCosts = 0;
    this.lastMonthIncomes = 0;
    this.isShownAmount = false;
   this.calculateAmout();
  }

  changeCosts() {
    if(this.apps != 'costs') {
      this.apps = 'costs';
    } else {
      this.apps ='amount';
    }
  console.log(this.apps);
}
  changeIncomes() {
      if(this.apps != 'incomes') {
        this.apps = 'incomes';
      } else {
        this.apps ='amount';
      }
    console.log(this.apps);
  }

  calculateAmout() {

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
              console.log("pateto ranpi")
              this.lastMonthIncomes += +income.value;
            } else if (!income.isIncome ){
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

  goToProgram(fab?: FabContainer){
    fab.close();
    this.navCtrl.push(FinanceProgram);
  }
  goToTaskManager(fab?: FabContainer){
    fab.close();
    this.navCtrl.push(MainPage);
  }
  refresh() {
    this.navCtrl.push(MenuPage);

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

  ionViewDidLoad() {

    this.storage.get('amount').then((amount) => {
       this.storage.get('lastMonthIncomes').then((incomes) => {
         this.lastMonthIncomes = incomes;
         this.storage.get('lastMonthCosts').then((costs) => {
           this.lastMonthCosts = costs;
            this.amount = amount;  
     console.log(costs);  
 
 
     this.barChart = new Chart(this.barCanvas.nativeElement, {
 
         type: 'bar',
         data: {
             labels: ["Amount", "Month Incomes", "Month Costs"],
             datasets: [{
                 label: 'лв',
                 data: [this.amount, this.lastMonthIncomes,this.lastMonthCosts],
                 backgroundColor: [
                     'rgba(255, 99, 132, 0.2)',
                     'rgba(54, 162, 235, 0.2)',
                     'rgba(255, 206, 86, 0.2)',
                     'rgba(75, 192, 192, 0.2)',
                     'rgba(153, 102, 255, 0.2)',
                     'rgba(255, 159, 64, 0.2)'
                 ],
                 borderColor: [
                     'rgba(255,99,132,1)',
                     'rgba(54, 162, 235, 1)',
                     'rgba(255, 206, 86, 1)',
                     'rgba(75, 192, 192, 1)',
                     'rgba(153, 102, 255, 1)',
                     'rgba(255, 159, 64, 1)'
                 ],
                 borderWidth: 1
             }]
         },
         options: {
             scales: {
                 yAxes: [{
                     ticks: {
                         beginAtZero:true
                     }
                 }]
             }
         }
 
     });
   });
 });
   });
 }
}
