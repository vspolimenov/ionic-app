import { Note } from './note';
import { Services } from './../services';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DatePipe } from '@angular/common';

import { Component } from '@angular/core';
import { NavController, DateTime, Platform, AlertController, FabContainer } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html'
})
export class Notes {

  currentNote:Note;
  notesLength:number;
  notes: Array<Note> = [];
  constructor(public navCtrl: NavController, private storage: Storage) {
    this.currentNote = new Note;
    this.setProgram();
  }

  add() {
    if(this.currentNote.value != null && this.currentNote.value != "") {
    this.storage.get('noteSeq').then((value) => {
      
    this.currentNote.name  = value + "note";
    console.log(this.currentNote.name);
    this.storage.set( this.currentNote.name, this.currentNote);
    this.storage.set('noteSeq', value + 1);
    let note = new Note;
    note.name = this.currentNote.name;
    note.value = this.currentNote.value;
    this.notes.push(note);
    });
    }
  }
  remove(note:Note) {
    this.notes = this.notes.filter(n => n.name != note.name);
    this.storage.remove(note.name);
  }
  setProgram() {
    this.storage.get('noteSeq').then((val: number) => {
     
      this.notesLength = 0;
      while (val > 0) {
        this.storage.get(val - 1 + "note").then((tr) => {
          if(tr) {
          console.log(tr.name);
          this.notes.push(tr );
          this.notesLength++;
         
          }
        });
      
        val -= 1;
      }
});}
 
  goToNext(fab: FabContainer){
    fab.close();

    this.navCtrl.pop();

  }
 
}
