import { Component, ViewChild, ElementRef  } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { HomePage } from '../../pages/home/home';

import { AngularFireDatabase } from 'angularfire2/database';
import { LoadingController } from 'ionic-angular';
import {AngularFirestore, AngularFirestoreModule, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore'
import {Observable} from 'rxjs/Observable';

import * as firebase from 'firebase';

interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  telefono:string;
  ciudad:string;
}
declare var google;

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  @ViewChild('nombre') nombre:string;
  @ViewChild('email') email:string;
  @ViewChild('telefono') telefono:string;
  public objDataBase : SQLiteObject = null;
  usuariosCollection: AngularFirestoreCollection<Usuario>;
  loaderBuscandoRunner:any;
  

  
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public alertCtrl: AlertController, 
              public loadingCtrl: LoadingController, 
              private afs: AngularFirestore, 
              public platform: Platform, 
              private sqlite: SQLite,
              public geolocation: Geolocation) {
  
    //Garantiza que los modulos de la applicacion esten
    //cargados antes de llamar al plugin de BD
    //SP
    this.platform.ready().then(() => {
      this.CreatedataBase();
      setTimeout(() => {
        this.getInfoFromDB();
      }, 3000);  
    });

    this.usuariosCollection = this.afs.collection('usuarios');

    this.getUbicacion();

  }

  getUbicacion(){

    this.geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var latIniUser = latLng.lat();
      var lngIniUser = latLng.lng();
      
      localStorage.setItem("posicionInicialLat",latIniUser);
      localStorage.setItem("posicionInicialLng",lngIniUser);
      
      var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': latLng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0] != undefined) {


                          var address_component = results;
                          var itemRoute='';
                          var itemLocality='';
                          var itemCountry='';
                          var itemPc='';
                          var itemSnumber='';

                          var i;
                          // iterate through address_component array
                            for (i = 0; i < address_component.length; i++) {
                            console.log('address_component:'+i);

                              if (address_component[i].types[0] == "administrative_area_level_1"){
                                  console.log(i+": city:"+address_component[i].formatted_address);
                                  localStorage.setItem("ciudad", address_component[i].formatted_address);
                              }
                          };
                        }
                      }
                    });

    }, (err) => {
      console.log(err);
    });
    
  }
  

  //Metodos Base de Datos

  getInfoFromDB(){
    if( this.objDataBase != null  ){
      this.objDataBase.executeSql('SELECT nombre, email, telefono  FROM user', {})
      .then(res => {
        if(res.rows.length>0) {
          this.navCtrl.setRoot(HomePage);
          //alert(username + " >>>> " + password );
        }
      })
    }
  }

  CreatedataBase() {
    this.sqlite.create({
      name: 'sedesvara.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS user(rowid INTEGER PRIMARY KEY, nombre TEXT, email TEXT, telefono NUMBER)', {})
      .catch(e => {});//alert(e));
      this.objDataBase = db;
      this.getInfoFromDB();
    }).catch(e => {}//alert(e)
  );
  }

  saveUserName_Password() {
    this.presentLoadingCustom();
    if(this.nombre != undefined || this.email != undefined || this.telefono != undefined){

     var Usuario = {
        nombre: this.nombre,
        email: this.email,
        telefono: this.telefono,
        ciudad: localStorage.getItem("ciudad")
      }

      this.usuariosCollection.add(Usuario).then(
        _ref => {
            _ref.onSnapshot(docSnapshot => {
              if(docSnapshot != null){
                this.loaderBuscandoRunner.dismiss();
                this.showAlert("Confirmación","Se creó correctamente el registro");
                setTimeout(() => {
                  this.navCtrl.setRoot(HomePage);  
                }, 2000);
              }
            });
          });
      
      if( this.objDataBase != null  ){
        this.objDataBase.executeSql('delete from user', {})
        this.objDataBase.executeSql('INSERT INTO user VALUES(NULL,?,?,?)',[ this.nombre, this.email, this.telefono])
        .then(res => {
          //this.showAlert("Error","Usuario Registrado");
          //this.registrarUsuario(nombre, email, telefono);
          //this.toast.show('Data saved', '5000', 'center').subscribe(
          //  toast => {
          //    this.navCtrl.popToRoot();
          //  }
          //);
        })
        .catch(e => {
          this.showAlert("Error","Se presento un error al registrar el Usuario");
          //alert(e);
          //this.toast.show(e, '5000', 'center').subscribe(
          //  toast => {
          //    alert(toast);
          //  }
         // );
        });
      }
      
    }else{
      this.loaderBuscandoRunner.dismiss();
      this.showAlert("Error","Es muy importante para nosotros conocerte, por favor diligencia la información una única vez.");
    }
    
  }


  showAlert(titulo, subtitulo) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: subtitulo,
      buttons: ['OK']
    });
    alert.present();
  }

  presentLoadingCustom() {
    this.loaderBuscandoRunner = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: "Cargando..."
      //,duration: 2000
    });
    this.loaderBuscandoRunner.present();
  }


}
