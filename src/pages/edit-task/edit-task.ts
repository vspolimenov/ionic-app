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
  isFixed:boolean;
  constructor(public navCtrl: NavController,  private storage: Storage,  public localNotifications: LocalNotifications,
    public platform: Platform,
    public alertCtrl: AlertController) {
    this.task = new Task();
    this.storage.get('editedTask').then((val: number) => {
      this.taskSeq = val;
  
      this.storage.get(val + "task").then((task: Task) => {
        console.log(task);
        this.task.name = task.name;
        this.task.description = task.description;
        this.task.date = task.date;
        this.task.time = task.time;
        this.task.showInfo = task.showInfo;
        this.task.type = task.type;
      });
    });

  }

  deleteTask(fab: FabContainer){
    fab.close();
this.storage.remove(this.taskSeq + "task");
    this.navCtrl.push(MainPage); 
  }
 
  goToNext(fab: FabContainer){
    fab.close();
    var date = new Date(this.task.date + " " + this.task.time);
  console.log(date);
  this.localNotifications.schedule({
     text: this.task.name + ' ' + this.task.description,
     trigger: { at: date},
     led: 'FF0000'
  });
  let alert = this.alertCtrl.create({
    title: 'New Task!',
    subTitle: 'to' +date,
    buttons: ['OK']
  });
  alert.present();
    this.task.isDone = false;
    this.task.taskId = this.taskSeq;
    this.storage.set(this.taskSeq + "task",this.task);
    this.navCtrl.push(MainPage);    
  }
  goBack(fab: FabContainer){
    fab.close();
    this.navCtrl.push(MainPage);    
	}
}
