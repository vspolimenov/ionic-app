import { MorePage } from './../more/more';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'page-setings',
  templateUrl: 'setings.html'
})
export class SetingsPage {
  public todo: FormGroup;
  error:boolean;
  constructor(public navCtrl: NavController, private storage: Storage,private formBuilder: FormBuilder) {
    this.todo = this.formBuilder.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      });
      this.error = false;
    this.storage.get('name').then((val) => {
      this.todo.get('name').setValue(val);
    });
  }
  goToNext(){
    if(this.todo.get('age').value <= 0 || this.todo.get('age').value > 120) {
      this.error = true;
      return;
    }
    console.log(this.todo.get('name').value);
    this.storage.set('name',  this.todo.get('name').value);
    this.storage.set('age',  this.todo.get('name').value);
    this.navCtrl.push(MorePage);
    
	}
}
