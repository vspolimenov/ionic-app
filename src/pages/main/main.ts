import { EditTaskPage } from './../edit-task/edit-task';
import { Program } from './../program/program';
import { HomePage } from './../home/home';
import { Task } from './task';
import { SetingsPage } from './../setings/setings';
import { Component } from '@angular/core';
import { NavController, FabContainer, AlertController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Storage } from '@ionic/storage';
import { NewTaskPage } from '../new-task/new-task';
@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {
  remainigToSleepHours:string;
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
      this.pinnedTasks = this.pinnedTasks.filter(deleted => deleted.taskId !== task.taskId);
      this.storage.set(task.taskId + "task", task);
    }
  }
 
  constructor(private backgroundMode: BackgroundMode, public navCtrl: NavController,public alertCtrl: AlertController, private storage: Storage) {
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
          if(task.pinned && task.isDone == false) {
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
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to delete this accout!',
      subTitle: 'All your data will be lost',
      buttons: [ {text: 'Delete',
      handler: data => {
        this.navCtrl.push(HomePage);
      }
    }, 'Cancel']
    });
    alert.present();


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
      let goToSleepTask:Task;
            goToSleepTask = new Task();
            goToSleepTask.date = new Date().toString();
            goToSleepTask.time = val;
            this.todaysDate = new Date();
            if(this.todaysDate.getHours() - val < 0){
              console.log(val); 
             goToSleepTask .remaining = "in " + ( val - this.todaysDate.getHours()) + "h";
            } else if(this.todaysDate.getHours() - val == 0){
              goToSleepTask.remaining ="in < 1h";
            } else if(this.todaysDate.getHours() - val > 0 && this.todaysDate.getHours() - val <= 3 ) {
              goToSleepTask .remaining = "before " +  (- val + this.todaysDate.getHours()) + "h";
            } else {
              let nexDay:number;
              nexDay = val - this.todaysDate.getHours() + 24;

              goToSleepTask .remaining = "in " +  nexDay + "h";
            }
          console.log(goToSleepTask.remaining + "remaining");
          this.remainigToSleepHours = goToSleepTask.remaining;
    })
    });

  }

  changeTask(task:Task) {
    this.storage.set('editedTask', task.taskId);
    this.navCtrl.push(EditTaskPage);
  }
}
