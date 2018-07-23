import { Component, ViewChild, ElementRef } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { NavController, AlertController, Nav, Platform } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { InfoEmpresasPage } from '../../pages/info-empresas/info-empresas';

import { LoadingController } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';

import { Geolocation } from '@ionic-native/geolocation';

import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase';

declare var google: any;

interface Ciudad{
  id?: string;
  estado: string;
  Nombre: string;
  latitud:string;
  longitud: string;
}

interface Publicidad{
  id?: string;
  estado: string;
  Nombre: string;
  url: string;
  latitud:string;
  longitud: string;
  imagenesPublicidad: [{id:string, src:string}];
}

interface establecimiento{
  id?: string;
  NOMBRE:string;
  DIRECCIÓN:string;
  LATITUD:string;
  LONGITUD:string;
  TELEFONOS:{
    TELEFONO:string;
  };
  TIPO_NEGOCIO:{
    TIPO_NEGOCIO:string;
  };
  /*tipoNegocio1:string;
  tipoNegocio2:string;
  tipoNegocio3:string;
  tipoNegocio4:string;*/
  SERVICIOS:{
    SERVICIO:string;
  };
  /*servicio1:string;
  servicio2:string;
  servicio3:string;
  servicio4:string;
  servicio5:string;
  servicio6:string;
  servicio7:string;
  servicio8:string;
  servicio9:string;
  servicio10:string;*/
  mail:string;
  TIPOS_TRANSPORTE:{
    TIPOS_TRANSPORTE:string;
  };
  /*tipoTransporte1:string;
  tipoTransporte2:string;
  tipoTransporte3:string;
  tipoTransporte4:string;*/
  ciudad:string;
  RS_FACEBOOK:string;
  RS_INSTAGRAM:string;
  RS_YOUTUBE:string;
  imagen:string;
  textoLargo:string;

};

var contaPautas=0;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //task: Observable<any>;

  @ViewChild('map') mapRef: ElementRef;
  @ViewChild('textSearch') textSearch:ElementRef;
  showServicios: boolean;
  buscar: boolean;
  showTipoTransporte: boolean;
  showTipoServicios: boolean;
  ciudadesSel: boolean;
  slidesPub: boolean;
  urlPublicidad: string;
  idPublicidad: string;
  imagenesPublicidad = [];
  establecimientos: AngularFirestoreCollection<any>;
  establecimientos__: AngularFirestoreCollection<any>;
  ciudades: Observable<any[]>;
  publicidades: AngularFirestoreCollection<any>;
  publicidadesObservable: Observable<any[]>;
  publicidadEspecifica: AngularFirestoreCollection<any>;
  publicidadEspecificaObservable: Observable<any[]>;
  establecimientosObservable: Observable<any[]>;
  establecimientosObservable__: Observable<any[]>;
  establecimiento: AngularFirestoreDocument<establecimiento>;
  serviciosCollection: AngularFirestoreCollection<establecimiento>;
  markers = [];
  publicidad = [];
  slidesPublicidad = [];
  map: any;
  user:any;
  loaderBuscandoRunner:any;
  Ref: any;
  twoRef: any;
  zoom: any;

  constructor(
              public navCtrl: NavController,  
              public alertController: AlertController, 
              private db: AngularFirestore,
              public alertCtrl: AlertController, 
              public loadingCtrl: LoadingController, 
              public geolocation: Geolocation,
              public platform: Platform,
              private diagnostic: Diagnostic) {

              //Sobrescribe la funcionalidad del a tecla atras en 
              //la plataforma android....
              //sp
              /*platform.registerBackButtonAction(() => {
                let activeView: ViewController = navCtrl.getActive();
                if(activeView != null){
                  if(activeView.id != 'page-home') {
                    this.showTipoTransporte = true;
                    this.showTipoServicios = false;
                    this.showServicios = false;
                  }
                }
              });*/

              this.obtenerCiudades();
              this.obtenerPublicidad();
             
              this.showServicios = true;
              this.showTipoTransporte = true;
              this.showTipoServicios = false;
              this.buscar = false;
              this.markers = [];

  }

  ionViewDidLoad(){
    this.showMap();
    
  }

  mostrarBuscar(){
    if(this.buscar == true){
      this.buscar = false;
    }else if(this.buscar == false){
      this.buscar = true;
    }
    
  }

  obtenerCiudades(){
    this.ciudades = this.db.collection('ciudades', ref =>{
      return ref.where('estado','==',"ok");
    }).snapshotChanges().map(changes =>{
      return changes.map(a =>{
        const data = a.payload.doc.data() as Ciudad;
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }

  obtenerPublicidad(){

    this.publicidades = this.db.collection('publicidad', ref =>{
      return ref.where('Estado','==',"Activo");
    });
    
    this.publicidadesObservable  = this.publicidades.snapshotChanges();
    var i = 0;
    this.publicidadesObservable.forEach( este => {  este.forEach ( esteData =>{
        let data = esteData.payload.doc.data();
        let id = esteData.payload.doc.id;
        
        this.publicidad.push({"data": data, "id": id});
        
    });
  });
    
  setInterval(() => {
    if(contaPautas >= this.publicidad.length){
      contaPautas = 0;
    }
    this.urlPublicidad = this.publicidad[contaPautas].data.url;
    this.idPublicidad = this.publicidad[contaPautas].id;

    contaPautas++;
}, 5000);

  
}

cerrarCarrusel(){
  this.slidesPub = false;
}

getPublicidadInfo(idPublicidad){
  
  var i;
  // iterate through address_component array
    for (i = 0; i < this.publicidad.length; i++) {
        if(this.publicidad[i].id == idPublicidad){
            this.slidesPublicidad = this.publicidad[i].data.imagenesPublicidad;
            this.slidesPub = true;
            break;
        }
    }

}

  presentLoadingCustom() {
    this.loaderBuscandoRunner = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: "Cargando..."
      //,duration: 2000
    });
    this.loaderBuscandoRunner.present();
  }

  tipoEstablecimiento(tipoEstablecimiento){
    localStorage.setItem("tipoEstablecimiento", tipoEstablecimiento);
    this.showTipoTransporte = false;
    this.showTipoServicios = false;
    this.ciudadesSel = true;
  }
  

  ObtenerEstablecimientos(ciudad, lat, lng){

    var tipoTransporte = localStorage.getItem("tipoTransporte");
    var tipoEstablecimiento = localStorage.getItem("tipoEstablecimiento");
    this.showTipoTransporte = true;
    this.showTipoServicios = false;
    this.showServicios = false;
    var empty = true;

    /*if(ciudad.startsWith("Bog")){
        ciudad = "BOGOTA";
    }*/

    // ~1 mile of lat and lon in degrees
    let latMile = 0.0144927536231884
    let lonMile = 0.0181818181818182

    let lowerLat = lat - (latMile * 1)
    let lowerLon = lng - (lonMile * 100)

    let greaterLat = lat + (latMile * 1)
    let greaterLon = lng + (lonMile * 100)

    if(ciudad == ""){

      this.establecimientos__ = this.db.collection('establecimientos', ref =>{
          return ref.where('LATITUD','>=', lowerLat).where('LATITUD','<=', greaterLat).limit(100);//.where('TIPOS_TRANSPORTE', '==', tipoTransporte).where('TIPO_NEGOCIO', '==', tipoEstablecimiento).limit(100);//.where('LONGITUD','>=', lowerLon).where('LONGITUD','<=', greaterLon);
        //return ref.where('CIUDAD','==', ciudad);
      });

    }else {
      this.establecimientos__ = this.db.collection('establecimientos', ref =>{
        return ref.where('CIUDAD','==', ciudad).limit(100);  //.where('TIPOS_TRANSPORTE', '==', tipoTransporte).where('TIPO_NEGOCIO', '==', tipoEstablecimiento).limit(100);
      });
    }

    
    
    this.establecimientosObservable__  = this.establecimientos__.snapshotChanges();
    
    this.establecimientosObservable__.forEach( este => {  este.forEach ( esteData =>{
        let data = esteData.payload.doc.data();
        let id = esteData.payload.doc.id;
        const location = new google.maps.LatLng(data.LATITUD, data.LONGITUD);
        var icono = "";
        var tipoNegocioDisponible = [];
        var tipoTransporteDisponible = [];

        var infoEstablecimiento = {"nombre":data.NOMBRE, 
                                    "telefono":[], 
                                    "direccion":data.DIRECCIÓN, 
                                    "servicios":[], 
                                    "facebook":data.RS_FACEBOOK, 
                                    "instagram":data.RS_INSTAGRAM,
                                    "twitter":data.RS_YOUTUBE,
                                    "tipoNegocio":[],
                                    "imagenes":[],
                                    "imagen":  '../../assets/imgs/background-SeDesvara.png' //data.IMAGEN
                                    };

          var telefonosEstab = [];
          for (var i=0; i<data.TELEFONOS.length; i++) {
            if(data.TELEFONOS[i].TELEFONO != "N/I"){
              telefonosEstab.push(data.TELEFONOS[i].TELEFONO);
            }
          }
          
          infoEstablecimiento.telefono = telefonosEstab;

          var serviciosEstab = [];
          for (var i=0; i<data.SERVICIOS.length; i++) {
            if(data.SERVICIOS[i].SERVICIO != "N/I"){
              serviciosEstab.push(data.SERVICIOS[i].SERVICIO);
            }
          }
          
          infoEstablecimiento.servicios = serviciosEstab;

          var tipoNegocioEstab = [];
          for (var i=0; i<data.TIPO_NEGOCIO.length; i++) {
            if(data.TIPO_NEGOCIO[i].TIPO_NEGOCIO != "N/I"){
              tipoNegocioEstab.push(data.TIPO_NEGOCIO[i].TIPO_NEGOCIO);
            }
          }
          
          infoEstablecimiento.tipoNegocio = tipoNegocioEstab;

          var imagenesEstab = [];
          for (var i=0; i<data.IMAGENES.length; i++) {
            if(data.IMAGENES[i] != ""){
              imagenesEstab.push(data.IMAGENES[i]);
            }
          }
          
          infoEstablecimiento.imagenes = imagenesEstab;

          for (var i=0; i<data.TIPO_NEGOCIO.length; i++) {
            if(data.TIPO_NEGOCIO[i].TIPO_NEGOCIO == 'ALMACEN'){
              icono = "assets/imgs/markers/iconalmacenes1.png";
              tipoNegocioDisponible.push('ALMACEN');
            }else if(data.TIPO_NEGOCIO[i].TIPO_NEGOCIO == 'CONCESIONARIOS'){
              icono = "assets/imgs/markers/iconconcesionarios1.png";
              tipoNegocioDisponible.push('CONCESIONARIOS');
            }else if(data.TIPO_NEGOCIO[i].TIPO_NEGOCIO == 'TALLER'){
              icono = "assets/imgs/markers/icontalleres1.png";
              tipoNegocioDisponible.push('TALLER');
            }else if(data.TIPO_NEGOCIO[i].TIPO_NEGOCIO == 'OTROS SERVICIOS'){
              icono = "assets/imgs/markers/iconotrosServicios1.png";
              tipoNegocioDisponible.push('OTROS SERVICIOS');
            }
          }

          for (var i=0; i<data.TIPOS_TRANSPORTE.length; i++) {
            if(data.TIPOS_TRANSPORTE[i].TIPOS_TRANSPORTE == 'AUTOMOVILES'){
              tipoTransporteDisponible.push('AUTOMOVILES');
            }else if(data.TIPOS_TRANSPORTE[i].TIPOS_TRANSPORTE == 'MOTOS '){
              tipoTransporteDisponible.push('MOTOS');
            }else if(data.TIPOS_TRANSPORTE[i].TIPOS_TRANSPORTE == 'TRANSPESADO'){
              tipoTransporteDisponible.push('TRANSPESADO');
            }else if(data.TIPOS_TRANSPORTE[i].TIPOS_TRANSPORTE == 'ELECTRICAS'){
              tipoTransporteDisponible.push('ELECTRICAS');
            }
          }

          let iconIMG = {
            url: icono,
            size: new google.maps.Size(63, 81),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(31.5, 81)
          };
          
          for(var i = 0; i < tipoNegocioDisponible.length; i++){
            for(var h = 0; h < tipoTransporteDisponible.length; h++){
              if(tipoNegocioDisponible[i] == tipoEstablecimiento && tipoTransporteDisponible[h] == tipoTransporte){
                empty = false;
                this.addMarker(location, this.map, iconIMG, infoEstablecimiento);
              }
            }
         }
        });

        
      
        if (empty == true){
          this.showAlert("Error","No existen Resultados para su busqueda.");
          this.deleteMarkers();
        }else if(this.markers != null || this.markers.length != 0){
          this.setMapOnAll(this.map);
        }else{
          this.deleteMarkers();
        }

    });
    
    this.showTipoTransporte = true;
    this.showTipoServicios = false;
    this.ciudadesSel = false;
    this.showServicios = false;

  }

  getCiudadPosicionActual(latitud, longitud){

    this.geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(latitud, longitud);
      
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
                                  //localStorage.setItem("ciudadPosicionActual", address_component[i].formatted_address);
                              }
                          };
                        }
                      }
                    });

    }, (err) => {
      console.log(err);
    });
    
  }

  ubicarPosicionCiudad(latitud, longitud){
    this.geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(latitud, longitud);
      
      this.user.setMap(this.map);
      this.user.setPosition(latLng);

      this.map.panTo(latLng);
      
    }, (err) => {
      console.log(err);
    });
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  showAlert(titulo, subtitulo) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: subtitulo,
      buttons: ['OK']
    });
    alert.present();
  }

  ubicarPosicionEnMapa(){

    this.presentLoadingCustom();
    this.geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var latIniUser = latLng.lat();
      var lngIniUser = latLng.lng();
      
      this.user.setMap(this.map);
      this.user.setPosition(latLng);
      
      this.map.panTo(latLng);

      this.getCiudadPosicionActual(latIniUser, lngIniUser);
      this.ObtenerEstablecimientos("", latIniUser, lngIniUser);
      this.loaderBuscandoRunner.dismiss();

    }, (err) => {
      alert(err);
      console.log(err);
    });

  }

  showMap(){
    // ubicacion
    const location = new google.maps.LatLng(localStorage.getItem("posicionInicialLat"), localStorage.getItem("posicionInicialLng"));
    
    //Opciones de mapa
    const options = {
        center: location,
        zoom: 16,
        streetViewControl: true,
        mapTypeId: 'roadmap',
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        rotateControl: false,
        fullscreenControl: false
        
    }

    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    
    this.user = new google.maps.Marker({
      map: this.map,
      position: location,
      draggable: false
    });

    localStorage.setItem("map", this.map);

    setTimeout(() => this.map.setMapTypeId('terrain'),3000);

  }

  addMarker(position, map, icon, infoEstablecimiento){

    var marker = new google.maps.Marker({
      position,
      map,
      icon, 
      nombre: infoEstablecimiento.nombre
    });

    
    google.maps.event.addListener(marker, 'click', () => {
      //infoWindow.open(this.map, marker);
      this.navCtrl.push(InfoEmpresasPage, infoEstablecimiento);
    });    

    

    this.markers.push(marker);
  }

  buscarEstablecimientos(){

    for (var i = 0; i < this.markers.length; i++) {
      if(this.markers[i].nombre.indexOf(this.textSearch) > -1){
        this.markers[i].setMap(this.map);
      }else{
        this.markers[i].setMap(null);
      }
    }
  }

  deleteMarkers() {
    this.setMapOnAll(null);
    this.markers = [];
  }

  setMapOnAll(map) {

    //hace ciclo sobre los marcadores que hemos guardado en la variable markers
    for (var i = 0; i < this.markers.length; i++) {
       this.markers[i].setMap(map);
    }

    /* Change markers on zoom */
    /*google.maps.event.addListener(map, 'zoom_changed', function() {
      this.zoom = map.getZoom();
      // iterate over markers and call setVisible
    });*/

   // var zoom = map.getZoom();
    /*for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setVisible(this.zoom <= 15);
    }*/
  }

  tipoTransporte(tipoTransporte){
    this.showTipoServicios = true;
    this.showTipoTransporte = false;
    localStorage.setItem("tipoTransporte", tipoTransporte);
  }



  cerrar(cerrar){
    this.deleteMarkers();
    this.showServicios = cerrar;
    
  }


}
