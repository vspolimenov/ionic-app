import { HomePage } from './../home/home';
import { Task } from './task';
import { SetingsPage } from './../setings/setings';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Storage } from '@ionic/storage';
import { NewTaskPage } from '../new-task/new-task';
@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {
  sleepHour:number;
  name:String;
  tasks: Array<Task> = [];
  tasksLength:number;
  public apps: String;
  time;
  timeInSeconds;
  runTimer;
  hasStarted;
  hasFinished;
  remainingTime;
  displayTime;
  tasksDoneCount:number;

public changeState(task:Task) {
if(task.isDone) {
  task.isDone = false;
  this.storage.set(task.taskId+"task",task);
} else {
  task.isDone = true;
  this.storage.set(task.taskId+"task",task);
}
}
goToNewTask() {
  this.navCtrl.push(NewTaskPage);
}
goToNext(){
  this.navCtrl.push(HomePage);
  
}
  constructor(private backgroundMode: BackgroundMode, public navCtrl: NavController,  private storage: Storage) {
    let sleepHour :number;

    this.storage.get('sleepHour').then((val) => {
    console.log(new Date(val));  
    });
    this.apps = 'top';
    this.backgroundMode.enable();
    this.storage.get('name').then((val) => {
      this.name = val;
    });

    this.storage.get('taskSeq').then((val:number) => {
      console.log(val);
      this.tasksLength =val;
      while(val != 0) {
        this.storage.get(val-1+"task").then((task) => {
          console.log(task);
          this.tasks.push( task);
    });
    val -=1;
  }
    });
  }
  checkDoneTasks(){
    this.tasksDoneCount = 0;
    for(let task of this.tasks) {
      if(task.isDone) {
        this.tasksDoneCount += 1;
      }
    }
  }
   goToAbout(){
    this.apps ="all";
  }
  
  openSocial(network: string) {
    console.log('Share in ' + network);
  }

  ngOnInit() {
    this.initTimer();
    this.startTimer();
  }
  
  initTimer() {
     // Pomodoro is usually for 25 minutes
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
    var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
  }
}
