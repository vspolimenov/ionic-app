import { MenuPage } from './../../menu/menu';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DatePipe } from '@angular/common';
import { Task } from './../main/task';
import { MainPage } from './../main/main';
import { Component } from '@angular/core';
import { NavController, DateTime } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-more',
  templateUrl: 'more.html'
})
export class MorePage {
  taskSeq: number;
  currency:string;
  sleepHour:string;
  wakeupHour:string;
  amount:number;
  constructor(public navCtrl: NavController,
    private storage: Storage,
    private datePipe: DatePipe,
    public localNotifications: LocalNotifications,
    private formBuilder: FormBuilder) {
  }
  public createTask(name: string, hour: string) {
    let task = new Task();
    var todaysDate = new Date();
    task.date = this.datePipe.transform(todaysDate, 'yyyy-MM-dd');
    task.name = name;
    task.time = hour;
    task.type = "Everyday";
    task.isDone = false;
    task.taskId = this.taskSeq;
    task.isFixed = true;
    task.pinned = true;
    task.durations =  [,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,] ;
    var date = new Date(task.date + " " + task.time);
    console.log(date);
    this.localNotifications.schedule({
      text: task.name + ' ' + task.description,
      trigger: { at: date },
      led: 'FF0000'
    });
    this.storage.set(this.taskSeq + "task", task);
  }
  data = {
    alarm: false
  };
  goToNext() {
    this.taskSeq = 0;
 
        this.createTask("Morning teeth brush", this.wakeupHour);
        this.taskSeq = 1;
        this.createTask("Morning 15 min meditation", this.wakeupHour);
        this.taskSeq = 2;

      this.createTask("Night teeth brush", this.sleepHour);
 
    this.taskSeq = 3;
    this.storage.set('taskSeq', 3);

    this.storage.set('sleepHour', this.sleepHour);
    this.storage.set('wakeupHour', this.wakeupHour);
    this.storage.set('amount', this.amount);
    this.navCtrl.push(MenuPage);
    this.storage.set('incomeSeq', 0);
    this.storage.set('currency', this.currency);
  }
  goBack() {
    this.navCtrl.pop();
  }
}
//<ion-datetime displayFormat="HH:mm" [(ngModel)]="parisTime"></ion-datetime>