import { EditTaskPage } from './../pages/edit-task/edit-task';
import { DatePipe } from '@angular/common';
import { Program } from './../pages/program/program';
import { NewTaskPage } from './../pages/new-task/new-task';
import { MainPage } from './../pages/main/main';
import { MorePage } from './../pages/more/more';
import { SetingsPage } from './../pages/setings/setings';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { BackgroundMode } from '@ionic-native/background-mode';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SetingsPage,
    MorePage,
    MainPage,
    NewTaskPage,
    Program,
    EditTaskPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage, 
    SetingsPage, 
    MorePage,
    MainPage,
    NewTaskPage,
    Program,
    EditTaskPage
  ],
  providers: [
    SplashScreen,
    BackgroundMode,
    DatePipe,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
