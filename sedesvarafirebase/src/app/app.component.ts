import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ContactoPage } from '../pages/contacto/contacto';
import { TerminosPage } from '../pages/terminos/terminos';
import { PaginaInicioPage } from '../pages/pagina-inicio/pagina-inicio';
import { RegistroPage } from '../pages/registro/registro';
import { InfoEmpresasPage } from '../pages/info-empresas/info-empresas';

@Component({
  templateUrl: 'app.html' 
})
export class MyApp {
  
  @ViewChild('NAV') nav: Nav;
  public pages: Array<{ titulo: string, component: any, icon: string }>;
  public rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    this.rootPage = HomePage;//PaginaInicioPage;//;
  
    this.pages = [
        {titulo:'Inicio', component: HomePage, icon: 'home'},
        //{titulo:'Términos y Condiciones', component:TerminosPage, icon: 'mail'},
        {titulo:'Contacto', component:ContactoPage, icon: 'information-circle'} 
         
    ];

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  goToPage(page){
    this.nav.setRoot(page);
 }

}

