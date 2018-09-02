import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DatePipe } from '@angular/common';
import { Task } from './../main/task';
import { MainPage } from './../main/main';
import { Component } from '@angular/core';
import { NavController, DateTime } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-more',
  templateUrl: 'more.html'
})
export class MorePage {
  public todo: FormGroup;
  taskSeq: number;
  error:boolean;
  constructor(public navCtrl: NavController,
    private storage: Storage,
    private datePipe: DatePipe,
    public localNotifications: LocalNotifications,
    private formBuilder: FormBuilder) {
      this.error = false;
    this.todo = this.formBuilder.group({
      sleepHour: ['', Validators.required],
      wakeupHour: ['', Validators.required],
    });
  }
  public createTask(name: string, hour: string) {
    let task = new Task();
    var todaysDate = new Date();
    task.date = this.datePipe.transform(todaysDate, 'yyyy-MM-dd');
    task.name = name;
    task.time = hour;
    task.type = "Everyday";
    task.isDone = false;
    task.taskId = this.taskSeq;
    var date = new Date(task.date + " " + task.time);
    console.log(date);
    this.localNotifications.schedule({
      text: task.name + ' ' + task.description,
      trigger: { at: date },
      led: 'FF0000'
    });
    this.storage.set(this.taskSeq + "task", task);
  }
  data = {
    alarm: false
  };
  goToNext() {
    this.taskSeq = 0;
    // console.log(this.wakeupHour);
    if (this.todo.get('wakeupHour').value < 0
      || this.todo.get('wakeupHour').value > 24
      || this.todo.get('sleepHour').value < 0
      || this.todo.get('sleepHour').value > 24) {
        this.error = true;
        return;
      }
      if (this.todo.get('wakeupHour').value.length < 2) {
        this.createTask("Morning teeth brush", "0" + this.todo.get('wakeupHour').value + ":00");
        this.taskSeq = 1;
        this.createTask("Morning 15 min meditation", "0" + this.todo.get('wakeupHour').value + ":00");
        this.taskSeq = 2;

      } else {
        this.createTask("Morning teeth brush", this.todo.get('wakeupHour').value + ":00");
        this.taskSeq = 1;
        this.createTask("Morning 15 min meditation", this.todo.get('wakeupHour').value + ":00");
        this.taskSeq = 2;

      }
    if (this.todo.get('sleepHour').value.length < 2) {
      this.createTask("Night teeth brush", "0" + this.todo.get('sleepHour').value + ":00");
    } else {
      this.createTask("Night teeth brush", this.todo.get('sleepHour').value + ":00");
    }
    this.taskSeq = 3;
    this.storage.set('taskSeq', 3);

    this.storage.set('sleepHour', this.todo.get('sleepHour').value);
    this.storage.set('wakeupHour', this.todo.get('wakeupHour').value);
    this.navCtrl.push(MainPage);

  }
  goBack() {
    this.navCtrl.pop();
  }
}
//<ion-datetime displayFormat="HH:mm" [(ngModel)]="parisTime"></ion-datetime>