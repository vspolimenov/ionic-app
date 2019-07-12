import { Notes } from './../pages/task-manager/notes/notes';
import { Transactions } from './../pages/finance-manager/transactions/transactions';
import { FinanceProgram } from './../pages/finance-manager/finance-program/finance-program';
import { EditIncomePage } from './../pages/finance-manager/edit-task/edit-task';
import { Add } from './../pages/finance-manager/task-add/add';
import { NewMoneyCostOrIncomePage } from './../pages/finance-manager/new-task/new-money-cost-income';
import { MainFinancePage } from './../pages/finance-manager/main/main-finance';
import { MenuPage } from './../pages/menu/menu';
import { Services } from './../pages/task-manager/services';
import { EditTaskPage } from './../pages/task-manager/edit-task/edit-task';
import { DatePipe } from '@angular/common';
import { Program } from './../pages/task-manager/program/program';
import { NewTaskPage } from './../pages/task-manager/new-task/new-task';
import { MainPage } from './../pages/task-manager/main/main';
import { MorePage } from './../pages/task-manager/more/more';
import { SetingsPage } from './../pages/task-manager/setings/setings';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/task-manager/home/home';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { CalendarModule } from 'ionic3-calendar-en';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SetingsPage,
    MorePage,
    MainPage,
    NewTaskPage,
    Program,
    EditTaskPage,
    MenuPage,
    MainFinancePage,
    NewMoneyCostOrIncomePage,
    Add,
    EditIncomePage,
    FinanceProgram,
    Transactions,
    Notes
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    CalendarModule
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
    EditTaskPage,
    MenuPage,
     MainFinancePage,
     NewMoneyCostOrIncomePage,
     Add,
     EditIncomePage,
     FinanceProgram,
     Transactions,
    Notes
     
  ],
  providers: [
    SplashScreen,
    DatePipe,
    Services,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
