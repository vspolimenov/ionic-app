import { MenuPage } from './../../menu/menu';
import { HomePage } from './../home/home';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage } from '@ionic/storage';
import { Task } from './../main/task';
import { MainPage } from './../main/main';
import { Component } from '@angular/core';
import { NavController, Platform, AlertController, FabContainer, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-new-task',
  templateUrl: 'new-task.html'
})
export class NewTaskPage {
  task:Task;
  taskSeq:number;
  noReminder:boolean;
  constructor(public navCtrl: NavController,  private storage: Storage,  public localNotifications: LocalNotifications,
    public platform: Platform,
    public alertCtrl: AlertController) {

    this.task = new Task;
    this.storage.get('taskSeq').then((val) => {
    
      this.storage.set('taskSeq',val+1);
      this.taskSeq = val;
   });
  }

  goToNext(){
     
  if(!this.task.isFixed) {
    this.task.time = "12:00";
  }
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
  console.log("is fixed" + this.task.isFixed);
  
    this.task.isDone = false;
    this.task.money = 0;
    this.task.taskId = this.taskSeq;
    this.task.durations =  [,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,] ;
    this.storage.set(this.taskSeq + "task",this.task);
    this.navCtrl.popToRoot();
  }
  goBack(fab: FabContainer){
    fab.close();
    this.navCtrl.pop(); 
  }
}
