import { MainFinancePage } from './../../finance-manager/main/main-finance';
import { MenuPage } from './../../menu/menu';
import { Services } from './../services';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DatePipe } from '@angular/common';
import { EditTaskPage } from './../edit-task/edit-task';
import { Program } from './../program/program';
import { HomePage } from './../home/home';
import { Task } from './task';
import { SetingsPage } from './../setings/setings';
import { Component } from '@angular/core';
import { NavController, FabContainer } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Storage } from '@ionic/storage';
import { NewTaskPage } from '../new-task/new-task';
@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {
  sleepHour: number;
  wakeupHour:number;
  todaysDate:Date;
  name: String;
  tasks: Array<Task> = [];
  pinnedTasks: Array<Task> = [];
  tasksLength: number;
  public apps: String;
  time;
  timeInSeconds;
  runTimer;
  hasStarted;
  hasFinished;
  remainingTime;
  displayTime;
  tasksDoneCount: number;

 
  ngOnInit() {
    this.storage.get('sleepHour').then((val) => {
      this.storage.get('wakeupHour').then((wakeup) => {


      if(wakeup > new Date().getHours() ) {
        this.todaysDate = new Date(this.todaysDate);
        this.todaysDate.setDate(this.todaysDate.getDate() - 1);
        this.timeInSeconds = -1;
      } else {
              this.timeInSeconds = Math.abs((new Date().getHours() - val)) * 60 * 60;
      }
      this.initTimer();
      this.startTimer();
              
    })
    });

  }
  constructor(private backgroundMode: BackgroundMode,
     public navCtrl: NavController,
     public localNotifications: LocalNotifications,
       private datePipe: DatePipe,
        private storage: Storage,
        public services:Services) {
    let sleepHour: number;
  
    this.apps = 'top';
    this.backgroundMode.enable();
    this.storage.get('name').then((val) => {
      if(!val) {
        this.navCtrl.push(HomePage);
      } else {
      this.name = val;
      }
    });
  
    this.storage.get('taskSeq').then((val: number) => {
      this.tasksLength = 0;
      while (val > 0) {
        this.storage.get(val - 1 + "task").then((task) => {
          this.todaysDate = new Date();
          if(task){
          if(task.pinned && new Date(task.date).getDate() &&   this.todaysDate.getDate() - new Date(task.date).getDate() == 0 || task.taskId < 3) {
            this.calculateRemainig(task);
            this.pinnedTasks.push(task);
          }
          this.tasks.push(task);
          this.tasksLength++;
         } });
        val -= 1;
      }
    });
  }


  calculateRemainig(task:Task) {
    this.todaysDate = new Date();
    if (task.type == "Everyday") {
      var date = new Date(this.todaysDate);
      this.localNotifications.schedule({
        text: task.name,
        trigger: { at: date },
        led: 'FF0000'
      });
     task.date = this.todaysDate.toDateString();
    } else if (task.type == "Weekly" || task.type == "Weekend") {
      console.log("kur "+ task.date + (this.todaysDate.getDay() - new Date(task.date).getDay()));
      if(this.todaysDate.getDay() - new Date(task.date).getDay() > 0){
   // var date = new Date(this.todaysDate.setDate(this.todaysDate.getDate()  + 1 +(new Date(task.date).getDay() -this.todaysDate.getDay())));
      var day = this.todaysDate.setDate(this.todaysDate.getDate()  + 1 + (new Date(task.date).getDay() -this.todaysDate.getDay()));;
      this.localNotifications.schedule({
        text: task.name,
        trigger: { at: new Date(day) },
        led: 'FF0000'
      });
      
    }
      task.date = new Date(day).toDateString();
    }
    console.log("pute" + this.todaysDate.getMonth()  + " " +  new Date(task.date).getMonth());
    if(this.todaysDate.getDate() - new Date(task.date).getDate() == 0){
      if(this.todaysDate.getHours() - new Date(task.date + " " + task.time).getHours() < -1){
        task.remaining = "in " + ( new Date(task.date + " " + task.time).getHours() -this.todaysDate.getHours() - 1) + "h";
        } else if(this.todaysDate.getHours() - new Date(task.date + " " + task.time).getHours()== -1 && this.todaysDate.getMinutes() - new Date(task.date + " " + task.time).getMinutes() > 0){
        console.log(this.todaysDate.getHours() - new Date(task.date + " " + task.time).getHours());
        task.remaining ="in " + (60 - this.todaysDate.getMinutes() - new Date(task.date + " " + task.time).getMinutes()) + "min";
        }else {
      task.isDone = true;
      task.remaining = "PASSED";
    }
  } else {
    task.pinned=false;
  }
    if(task.isDone){
      task.remaining = "PASSED";
      this.storage.set(task.taskId + "task",task);
    }
  }
  checkDoneTasks() {
    this.tasksDoneCount = 0;
    for (let task of this.tasks) {
      if (task.isDone) {
        this.tasksDoneCount += 1;
      }
    }
  }
  startTask(task:Task) {
    task.startTime=new Date().getTime();
    task.isStarted = true;
    task.currentDuration = "0";
    task.durations[new Date().getDay()] = task.currentDuration;
    task.remaining = "NOW";
    this.storage.set(task.taskId + "task",task);
    console.log(task.startTime);
  }

  stopTask(task:Task) {
    task.endTime=new Date().getTime();
    task.isStarted = false;
    task.currentDuration = this.formatDuration(task.endTime - task.startTime);
    task.durations[new Date().getDay()]  =    task.currentDuration;
    this.storage.set(task.taskId + "task",task);
    task.isDone = true;
    task.remaining = "PASSED";
    console.log(new Date().getDay());
  }

  formatDuration(duration:number) {
    let convertedDuration; 
    if(duration * 2.77777778 * 0.00000001  > 1) {
     return (duration * 2.77777778 * 0.00000001).toFixed(0)  + " h";
    } else if (duration * 1.66666667  * 0.00001 > 1) {
      return (duration * 1.66666667  * 0.00001).toFixed(0) + " min";
    } else {
     return (duration *0.001).toFixed(0) + " s";
    }
  }
  showInfoStateChange(task: Task) {
    if (task.showInfo) {
      task.showInfo = false;
    } else {
      task.showInfo = true;
    }
  }
  goToAbout(fab?: FabContainer){
    fab.close();
    this.apps = "all";
  }
 goToNewTask(fab?: FabContainer){
    fab.close();
    this.navCtrl.push(NewTaskPage);
  }
  goToNext(fab?: FabContainer){
    fab.close();
    this.navCtrl.push(HomePage);

  }
  goToFinance(fab?: FabContainer){
    fab.close();
    this.navCtrl.push(MainFinancePage);

  }
  goToProgram(fab?: FabContainer){
    fab.close();
    this.navCtrl.push(Program);

  }
  refresh() {
    location.reload();

  }

  initTimer() {


    if (!this.timeInSeconds) {
      this.timeInSeconds = 1500;
    }

    this.time = this.timeInSeconds;
    this.runTimer = false;
    this.hasStarted = false;
    this.hasFinished = false;
    this.remainingTime = this.timeInSeconds;

    this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);

  }

  startTimer() {
    this.runTimer = true;
    this.hasStarted = true;
    this.timerTick();
  }

  pauseTimer() {
    this.runTimer = false;
  }

  resumeTimer() {
    this.startTimer();
  }

  timerTick() {
    setTimeout(() => {

      if (!this.runTimer) { return; }
      this.remainingTime--;
      this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
      if (this.remainingTime > 0) {
        this.timerTick();
      }
      else {
        this.hasFinished = true;
      }
    }, 1000);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
    if (inputSeconds < 0) {
      secondsString = "to go"
      return secondsString;
    }
    var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    hoursString = hours.toString() + 'h';
   if (hours == 0) {
      minutesString = " < 1h";
      return minutesString;
    } 
    return hoursString;
  }
  changeTask(task:Task) {
    this.storage.set('editedTask', task.taskId);
    this.navCtrl.push(EditTaskPage);
  }
  public changeState(task: Task) {
    this.services.changeState(task);
  }
}