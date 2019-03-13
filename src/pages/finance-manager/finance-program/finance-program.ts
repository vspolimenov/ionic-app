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
  selector: 'finance-program',
  templateUrl: 'finance-program.html'
})
export class FinanceProgram {
  amount:number;
  lastMonthIncomes:number;
  lastMonthCosts:number;

  @ViewChild('barCanvas') barCanvas;

  barChart: any;
  
  ngOnInit() {
  }
  constructor(public navCtrl: NavController, private storage: Storage){
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
