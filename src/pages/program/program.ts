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
  tasks: Array<Task> = [];
  constructor(public navCtrl: NavController, private storage: Storage, private datePipe: DatePipe,  public localNotifications: LocalNotifications,
    public platform: Platform,
    public alertCtrl: AlertController) {
    this.todaysDate = new Date();
    this.setProgram();
  }
  data = {
    alarm: false
  };
  setProgram() {
    this.tasks = new Array<Task>();
    this.storage.get('sleepHour').then((val: number) => {
      console.log(val);
      this.sleepHour = +val;

      console.log(this.sleepHour);
      this.storage.get('wakeupHour').then((val) => {
        this.wakeupHour = +val;


        this.storage.get('taskSeq').then((val: number) => {
          console.log(val);
          while (val != 0) {
            this.storage.get(val - 1 + "task").then((task: Task) => {
              if (task) {
                console.log(task + ": " + this.todaysDate);
                if (task.date == this.datePipe.transform(this.todaysDate, 'yyyy-MM-dd')) {

                  this.tasks.push(task);
                }
                else if (task.type == "Everyday") {
                  var date = new Date(this.todaysDate + " " + task.time);
                  console.log(date);
                  this.localNotifications.schedule({
                    text: task.name,
                    trigger: { at: date },
                    led: 'FF0000'
                  });
                  this.tasks.push(task);
                } else if (task.type == "Weekly" && this.isWeekday()) {
                  var date = new Date(this.todaysDate + " " + task.time);
                  console.log(date);
                  this.localNotifications.schedule({
                    text: task.name,
                    trigger: { at: date },
                    led: 'FF0000'
                  });
                  this.tasks.push(task);
                } else if (task.type == "Weekend" && !this.isWeekday()) {
                  var date = new Date(this.todaysDate + " " + task.time);
                  console.log(date);
                  this.localNotifications.schedule({
                    text: task.name,
                    trigger: { at: date },
                    led: 'FF0000'
                  });
                  this.tasks.push(task);
                }
              }
            });
            val -= 1;

          }
        });
      });
    });
  }
  nextDay(){
    this.todaysDate = new Date(this.todaysDate);
    this.todaysDate.setDate(this.todaysDate.getDate() + 1);
    this.setProgram();
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
  showInfoStateChange(task: Task) {
    if (task.showInfo) {
      task.showInfo = false;
    } else {
      task.showInfo = true;
    }
  }
  isWeekday(): boolean {
    let dayOfWeek = this.datePipe.transform(this.todaysDate, 'EEE');
    console.log("week " + dayOfWeek);
    if (dayOfWeek == "Sun") {
      return false;
    } else if (dayOfWeek == "Sat") {
      return false
    }
    return true;
  }
}
//<ion-datetime displayFormat="HH:mm" [(ngModel)]="parisTime"></ion-datetime>