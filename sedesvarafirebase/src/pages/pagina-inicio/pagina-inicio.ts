import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { RegistroPage } from '../../pages/registro/registro';

/**
 * Generated class for the PaginaInicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pagina-inicio',
  templateUrl: 'pagina-inicio.html',
})
export class PaginaInicioPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  registro(){
    this.navCtrl.setRoot(RegistroPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaginaInicioPage');
  }

}
