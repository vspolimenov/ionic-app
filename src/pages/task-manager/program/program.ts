import { Services } from './../services';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DatePipe } from '@angular/common';
import { Task } from './../main/task';
import { MainPage } from './../main/main';
import { Component } from '@angular/core';
import { NavController, DateTime, Platform, AlertController, FabContainer } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-program',
  templateUrl: 'program.html'
})
export class Program {
  sleepHour: number;
  wakeupHour: number;
  todaysDate: Date;
  currency:string;
  tasks: Array<Task> = [];
  constructor(public navCtrl: NavController, private storage: Storage, private datePipe: DatePipe,  public localNotifications: LocalNotifications,
    public platform: Platform,
    public alertCtrl: AlertController,
    public services:Services) {
    this.todaysDate = new Date();
    this.setProgram();
  }
  data = {
    alarm: false
  };
  setProgram() {

    this.storage.get('currency').then((val) => {
      
      this.currency = val;    

    this.tasks = new Array<Task>();
    this.storage.get('sleepHour').then((val) => {
      this.sleepHour = +val.substr(0,2);
      this.storage.get('wakeupHour').then((val) => {
        this.wakeupHour = +val.substr(0,2);
        this.storage.get('taskSeq').then((val: number) => {
          while (val != 0) {
            this.storage.get(val - 1 + "task").then((task: Task) => {
              if (task) {
                
                console.log(task);
                if(!this.isToday()) {
                  task.todayTime = null;
                }
                if (task.date == this.datePipe.transform(this.todaysDate, 'yyyy-MM-dd')) {
                  this.tasks.push(task);
                }
                else if (task.type == "Everyday") {
                  var date = new Date(this.todaysDate + " " + task.time);
                  this.localNotifications.schedule({
                    text: task.name,
                    trigger: { at: date },
                    led: 'FF0000'
                  });
                  console.log(this.todaysDate.getDay());
                  task.currentDuration = task.durations[this.todaysDate.getDay()];
                  this.tasks.push(task);
                } else if (task.type == "Weekly" && this.services.isWeekday(this.todaysDate)) {
                  var date = new Date(this.todaysDate + " " + task.time);
                  this.localNotifications.schedule({
                    text: task.name,
                    trigger: { at: date },
                    led: 'FF0000'
                  });
                  task.currentDuration = task.durations[this.todaysDate.getDay()];
                  this.tasks.push(task);
                } else if (task.type == "Weekend" && !this.services.isWeekday(this.todaysDate)) {
                  var date = new Date(this.todaysDate + " " + task.time);
                  this.localNotifications.schedule({
                    text: task.name,
                    trigger: { at: date },
                    led: 'FF0000'
                  });
                  task.currentDuration = task.durations[this.todaysDate.getDay()];
                  this.tasks.push(task);
                }
              }
            });
            val -= 1;

          }
        });
      });
    });     
  });
  }
  nextDay(){
    this.todaysDate = new Date(this.todaysDate);
    this.todaysDate.setDate(this.todaysDate.getDate() + 1);
    this.setProgram();
   
  }
  isToday():boolean {
    return this.datePipe.transform(this.todaysDate, 'yyyy-MM-dd')  == this.datePipe.transform(new Date(), 'yyyy-MM-dd');;
  }
  previousDay(){
    this.todaysDate = new Date(this.todaysDate);
    this.todaysDate.setDate(this.todaysDate.getDate() - 1);
    this.setProgram();
  }
  goToNext(fab: FabContainer){
    fab.close();

    this.navCtrl.pop();

  }
  onDaySelect($event){
    console.log($event.year,$event.month, $event);
    this.todaysDate.setFullYear($event.year,$event.month, $event.date);
    console.log(this.todaysDate);
       this.setProgram();
  }
  showInfoStateChange(task: Task) {
    if (task.showInfo) {
      task.showInfo = false;
    } else {
      task.showInfo = true;
    }
  }
 
}
