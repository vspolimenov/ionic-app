import { Task } from './../main/task';
import { Storage } from '@ionic/storage';
import { SetingsPage } from './../setings/setings';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  taskSeq:number;
  constructor(public navCtrl: NavController,  private storage: Storage) {
    this.storage.clear();
    this.taskSeq = 0;
    this.createTask("Mornign teeth brush");
    this.taskSeq = 1;
    this.createTask("Mornign 15 min meditation");
    this.storage.set('taskSeq',2);
  }
   goToAbout(){
    this.navCtrl.push(SetingsPage);
  }
  public createTask(name:string) {
    let task = new Task();
    task.name = name;
    task.isDone=false;
   task.taskId = this.taskSeq;
   this.storage.set(this.taskSeq + "task",task);
  }

  openSocial(network: string) {
    console.log('Share in ' + network);
  }
}