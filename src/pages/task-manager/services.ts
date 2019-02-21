import { Component, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from './main/task';
import { Storage } from '@ionic/storage';
@Injectable()
export class Services {

    constructor(private storage: Storage, private datePipe: DatePipe) {
      }
    isWeekday(todaysDate:Date): boolean {
        let dayOfWeek = this.datePipe.transform(todaysDate, 'EEE');
        if (dayOfWeek == "Sun") {
          return false;
        } else if (dayOfWeek == "Sat") {
          return false
        }
        return true;
      }

      public changeState(task: Task) {
        if (task.isDone) {
          task.isDone = false;
          this.storage.set(task.taskId + "task", task);
        } else {
          task.isDone = true;
          this.storage.set(task.taskId + "task", task);
        }
      }
}