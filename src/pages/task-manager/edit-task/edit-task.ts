import { MenuPage } from './../../menu/menu';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage } from '@ionic/storage';
import { Task } from './../main/task';
import { MainPage } from './../main/main';
import { Component } from '@angular/core';
import { NavController, Platform, AlertController, FabContainer } from 'ionic-angular';

@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html'
})
export class EditTaskPage {
  task:Task;
  taskSeq:number;
  noReminder:boolean;
  isFixed:boolean;
  error:boolean;
  constructor(public navCtrl: NavController,  private storage: Storage,  public localNotifications: LocalNotifications,
    public platform: Platform,
    public alertCtrl: AlertController) {
    this.task = new Task();
    this.storage.get('editedTask').then((val: number) => {
      this.taskSeq = val;
      this.error = false;
      this.storage.get(val + "task").then((task: Task) => {
        console.log(task);
        this.task.name = task.name;
        this.task.description = task.description;
        this.task.date = task.date;
        this.task.time = task.time;
        this.task.showInfo = task.showInfo;
        this.task.type = task.type;
        this.task.pinned = task.pinned;
        this.task.durations = task.durations;
        this.task.isFixed = task.isFixed;
        this.task.currentDuration = this.task.currentDuration;
        this.task.startTime = task.startTime;
        this.task.remaining = task.remaining;
        this.task.endTime = task.endTime;
        this.task.money = task.money;
        this.task.income = task.income;
        this.task.isStarted = task.isStarted;
        this.task.todayTime = task.todayTime;
      });
    });

  }

  deleteTask(fab: FabContainer){
    fab.close();
    this.storage.remove(this.taskSeq + "task");
    this.navCtrl.popToRoot();
  }
 
  goToNext(fab: FabContainer){
    if(!this.task.name || this.task.name.trim()  == ""  ||
    !this.task.date || this.task.date.trim()  == ""  ) {
      this.error = true;
      return;
    }
    if(!this.task.isFixed) {
      this.task.time = "12:00";
    }
    fab.close();
    var date = new Date(this.task.date + " " + this.task.time);
  console.log(date);
  if(!this.noReminder) {
  this.localNotifications.schedule({
     text: this.task.name + ' ' + this.task.description,
     trigger: { at: date},
     led: 'FF0000'
  });
}
  let alert = this.alertCtrl.create({
    title: 'New Task!',
    subTitle: 'New Task Created',
    buttons: ['OK']
  });
  alert.present();
  if(!this.task.isFixed &&  !this.task.time) {
    this.task.time = "12:00";
  }
    this.task.isDone = false;
    this.task.taskId = this.taskSeq;
    console.log("taskche " + this.task.date);
    this.storage.set(this.taskSeq + "task",this.task);
    this.navCtrl.popToRoot();
  }
  goBack(fab: FabContainer){
    fab.close();
 
    this.navCtrl.pop();    
	}
}
