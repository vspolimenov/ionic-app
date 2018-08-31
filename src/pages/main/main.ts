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

  public changeState(task: Task) {
    if (task.isDone) {
      task.isDone = false;
      this.storage.set(task.taskId + "task", task);
    } else {
      task.isDone = true;
      this.storage.set(task.taskId + "task", task);
    }
  }
 
  constructor(private backgroundMode: BackgroundMode, public navCtrl: NavController, private storage: Storage) {
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
    console.log("name"+ this.name);
  
    this.storage.get('taskSeq').then((val: number) => {
      console.log(val);
      this.tasksLength = 0;
      while (val > 0) {
        this.storage.get(val - 1 + "task").then((task) => {
          if(task){
          console.log(task);
          if(task.pinned) {
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
    console.log("таодаъ" + new Date(task.date + " " + task.time).getHours()+ " : " + this.todaysDate.getHours());
    if(this.todaysDate.getMonth() - new Date(task.date).getMonth() < 0) {
      task.remaining ="in " + ( new Date(task.date).getMonth() - this.todaysDate.getMonth()) + " month";
    } else if(this.todaysDate.getDate() - new Date(task.date).getDate() < 0){
      task.remaining ="in " +   (new Date(task.date).getDate() - this.todaysDate.getDate() ) + " days";
    } else if(this.todaysDate.getHours() - new Date(task.date + " " + task.time).getHours() < 0){
      console.log(task.remaining); 
      task.remaining = "in " + ( new Date(task.date + " " + task.time).getHours() -this.todaysDate.getHours()) + "h";
    } else if(this.todaysDate.getMinutes() - new Date(task.date + " " + task.time).getMinutes() < 0){
      task.remaining ="in " + ( new Date(task.date + " " + task.time).getMinutes() -  this.todaysDate.getMinutes()) + "min";
    }else {
      task.remaining = "PASSED"
    }
    console.log("re "+ task.remaining);
  }
  checkDoneTasks() {
    this.tasksDoneCount = 0;
    for (let task of this.tasks) {
      if (task.isDone) {
        this.tasksDoneCount += 1;
      }
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
  goToProgram(fab?: FabContainer){
    fab.close();
    this.navCtrl.push(Program);

  }
  refresh() {
    location.reload();

  }

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
      console.log(new Date().getHours() +" sleep: " + val);
      console.log(this.timeInSeconds + "chepp");
      this.initTimer();
      this.startTimer();
              
    })
    });

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
}
