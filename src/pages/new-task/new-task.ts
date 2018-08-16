import { Storage } from '@ionic/storage';
import { Task } from './../main/task';
import { MainPage } from './../main/main';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-new-task',
  templateUrl: 'new-task.html'
})
export class NewTaskPage {
  task:Task;
  taskSeq:number;
  constructor(public navCtrl: NavController,  private storage: Storage) {
    this.task = new Task;

    this.storage.get('taskSeq').then((val) => {
    
      this.storage.set('taskSeq',val+1);
      this.taskSeq = val;
   });
  }

 
  goToNext(){
    this.task.isDone = false;
    this.task.taskId = this.taskSeq;
    this.storage.set(this.taskSeq + "task",this.task);
    
    this.navCtrl.push(MainPage);
    
	}
}
