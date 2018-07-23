import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

import { Http } from '@angular/http';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import * as _ from 'lodash';

/**
 * Generated class for the TerminosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-terminos',
  templateUrl: 'terminos.html',
})


export class TerminosPage {

  ref = firebase.storage().ref('excel');

  usercreds = {
    email: '',
    password: ''
  }

  data;

  authState;

  constructor(public navCtrl: NavController, private afauth: AngularFireAuth, public navParams: NavParams, private afs: AngularFirestore, private http: Http) {
  }

  /*login() {
    this.login1(this.usercreds);
  }

  login1(usercreds) {
    this.afauth.auth.signInWithEmailAndPassword(usercreds.email, usercreds.password).then((user) => {
      this.authState = user;
      alert("Realizo la entrada.");
    })
  }

  authUser(): boolean {
    return this.authState !== null && this.authState !== undefined ? true : false;
  }

  firestorethis() {
    return new Promise((resolve) => {

    
       firebase.storage().ref('datosempresa.json').getDownloadURL().then((url) => {
        this.http.get(url).map(res => res.json()).subscribe((data) => {
          let somerand = JSON.stringify(data);
          this.storethis(data).then(() => {
            resolve();
          })
    })
       })
  })    
    
  }*/

  getJsonInfo(){  
    this.http.get('assets/data/establecimientos/datosempresa.json')
      .subscribe(res => this.data = res.json());
      alert(JSON.stringify(this.data));
      this.storethis(this.data);

  }

  storethis(somejson) {
    var a = 4265;
    return new Promise((resolve) => {

      _.map(somejson, (element, i) => {
        _.keys(element).map(elementkey => {
          this.afs.collection('establecimientos').doc('establecimiento' + a).set(element);
          
        })
        a++;
      })
      resolve();
    })

      
  }


}
