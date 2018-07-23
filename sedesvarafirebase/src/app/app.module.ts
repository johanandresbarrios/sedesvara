import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireAuth } from 'angularfire2/auth';

import {HttpModule} from '@angular/http';

import { Diagnostic } from '@ionic-native/diagnostic';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ContactoPage } from '../pages/contacto/contacto';
import { TerminosPage } from '../pages/terminos/terminos';
import { PaginaInicioPage } from '../pages/pagina-inicio/pagina-inicio';
import { RegistroPage } from '../pages/registro/registro';
import { InfoEmpresasPage } from '../pages/info-empresas/info-empresas';
import { AngularFirestore } from 'angularfire2/firestore';

import { Geolocation } from '@ionic-native/geolocation';

import { SQLite } from '@ionic-native/sqlite';

// Import the AF2 Module

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';


var firebaseConfig = {
  apiKey: "AIzaSyC_F_TcsAy6BZtnDBckJwJzgdE0b0K7VIg",
  authDomain: "sedesvarapp.firebaseapp.com",
  databaseURL: "https://sedesvarapp.firebaseio.com",
  projectId: "sedesvarapp",
  storageBucket: "sedesvarapp.appspot.com",
  messagingSenderId: "893207784388"
};

/*export const firebaseConfig = {
    apiKey: "AIzaSyDaxro1-Ie11x9sBvnyFYUuq3XX5PrtJmM",
    authDomain: "sedesvara-f8279.firebaseapp.com",
    databaseURL: "https://sedesvara-f8279.firebaseio.com",
    projectId: "sedesvara-f8279",
    storageBucket: "sedesvara-f8279.appspot.com",
    messagingSenderId: "629473823070"
}*/


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ContactoPage,
    TerminosPage,
    PaginaInicioPage,
    RegistroPage,
    InfoEmpresasPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ContactoPage,
    TerminosPage,
    PaginaInicioPage,
    RegistroPage,
    InfoEmpresasPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    Geolocation,
    AngularFirestore,
    Diagnostic,
    AngularFireAuth,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
