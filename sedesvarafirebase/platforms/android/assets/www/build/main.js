webpackJsonp([6],{

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_diagnostic__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_firestore__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_info_empresas_info_empresas__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__ = __webpack_require__(100);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







;
var contaPautas = 0;
var HomePage = (function () {
    function HomePage(navCtrl, alertController, db, alertCtrl, loadingCtrl, geolocation, platform, diagnostic) {
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
        this.navCtrl = navCtrl;
        this.alertController = alertController;
        this.db = db;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.platform = platform;
        this.diagnostic = diagnostic;
        this.imagenesPublicidad = [];
        this.markers = [];
        this.publicidad = [];
        this.slidesPublicidad = [];
        this.obtenerCiudades();
        this.obtenerPublicidad();
        this.showServicios = true;
        this.showTipoTransporte = true;
        this.showTipoServicios = false;
        this.buscar = false;
        this.markers = [];
    }
    HomePage.prototype.ionViewDidLoad = function () {
        this.showMap();
    };
    HomePage.prototype.mostrarBuscar = function () {
        if (this.buscar == true) {
            this.buscar = false;
        }
        else if (this.buscar == false) {
            this.buscar = true;
        }
    };
    HomePage.prototype.obtenerCiudades = function () {
        this.ciudades = this.db.collection('ciudades', function (ref) {
            return ref.where('estado', '==', "ok");
        }).snapshotChanges().map(function (changes) {
            return changes.map(function (a) {
                var data = a.payload.doc.data();
                data.id = a.payload.doc.id;
                return data;
            });
        });
    };
    HomePage.prototype.obtenerPublicidad = function () {
        var _this = this;
        this.publicidades = this.db.collection('publicidad', function (ref) {
            return ref.where('Estado', '==', "Activo");
        });
        this.publicidadesObservable = this.publicidades.snapshotChanges();
        var i = 0;
        this.publicidadesObservable.forEach(function (este) {
            este.forEach(function (esteData) {
                var data = esteData.payload.doc.data();
                var id = esteData.payload.doc.id;
                _this.publicidad.push({ "data": data, "id": id });
            });
        });
        setInterval(function () {
            if (contaPautas >= _this.publicidad.length) {
                contaPautas = 0;
            }
            _this.urlPublicidad = _this.publicidad[contaPautas].data.url;
            _this.idPublicidad = _this.publicidad[contaPautas].id;
            contaPautas++;
        }, 5000);
    };
    HomePage.prototype.cerrarCarrusel = function () {
        this.slidesPub = false;
    };
    HomePage.prototype.getPublicidadInfo = function (idPublicidad) {
        var i;
        // iterate through address_component array
        for (i = 0; i < this.publicidad.length; i++) {
            if (this.publicidad[i].id == idPublicidad) {
                this.slidesPublicidad = this.publicidad[i].data.imagenesPublicidad;
                this.slidesPub = true;
                break;
            }
        }
    };
    HomePage.prototype.presentLoadingCustom = function () {
        this.loaderBuscandoRunner = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: "Cargando..."
            //,duration: 2000
        });
        this.loaderBuscandoRunner.present();
    };
    HomePage.prototype.tipoEstablecimiento = function (tipoEstablecimiento) {
        localStorage.setItem("tipoEstablecimiento", tipoEstablecimiento);
        this.showTipoTransporte = false;
        this.showTipoServicios = false;
        this.ciudadesSel = true;
    };
    HomePage.prototype.ObtenerEstablecimientos = function (ciudad, lat, lng) {
        var _this = this;
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
        var latMile = 0.0144927536231884;
        var lonMile = 0.0181818181818182;
        var lowerLat = lat - (latMile * 1);
        var lowerLon = lng - (lonMile * 100);
        var greaterLat = lat + (latMile * 1);
        var greaterLon = lng + (lonMile * 100);
        if (ciudad == "") {
            this.establecimientos__ = this.db.collection('establecimientos', function (ref) {
                return ref.where('LATITUD', '>=', lowerLat).where('LATITUD', '<=', greaterLat).limit(100); //.where('TIPOS_TRANSPORTE', '==', tipoTransporte).where('TIPO_NEGOCIO', '==', tipoEstablecimiento).limit(100);//.where('LONGITUD','>=', lowerLon).where('LONGITUD','<=', greaterLon);
                //return ref.where('CIUDAD','==', ciudad);
            });
        }
        else {
            this.establecimientos__ = this.db.collection('establecimientos', function (ref) {
                return ref.where('CIUDAD', '==', ciudad).limit(100); //.where('TIPOS_TRANSPORTE', '==', tipoTransporte).where('TIPO_NEGOCIO', '==', tipoEstablecimiento).limit(100);
            });
        }
        this.establecimientosObservable__ = this.establecimientos__.snapshotChanges();
        this.establecimientosObservable__.forEach(function (este) {
            este.forEach(function (esteData) {
                var data = esteData.payload.doc.data();
                var id = esteData.payload.doc.id;
                var location = new google.maps.LatLng(data.LATITUD, data.LONGITUD);
                var icono = "";
                var tipoNegocioDisponible = [];
                var tipoTransporteDisponible = [];
                var infoEstablecimiento = { "nombre": data.NOMBRE,
                    "telefono": [],
                    "direccion": data.DIRECCIÓN,
                    "servicios": [],
                    "facebook": data.RS_FACEBOOK,
                    "instagram": data.RS_INSTAGRAM,
                    "twitter": data.RS_YOUTUBE,
                    "tipoNegocio": [],
                    "imagenes": [],
                    "imagen": '../../assets/imgs/background-SeDesvara.png' //data.IMAGEN
                };
                var telefonosEstab = [];
                for (var i = 0; i < data.TELEFONOS.length; i++) {
                    if (data.TELEFONOS[i].TELEFONO != "N/I") {
                        telefonosEstab.push(data.TELEFONOS[i].TELEFONO);
                    }
                }
                infoEstablecimiento.telefono = telefonosEstab;
                var serviciosEstab = [];
                for (var i = 0; i < data.SERVICIOS.length; i++) {
                    if (data.SERVICIOS[i].SERVICIO != "N/I") {
                        serviciosEstab.push(data.SERVICIOS[i].SERVICIO);
                    }
                }
                infoEstablecimiento.servicios = serviciosEstab;
                var tipoNegocioEstab = [];
                for (var i = 0; i < data.TIPO_NEGOCIO.length; i++) {
                    if (data.TIPO_NEGOCIO[i].TIPO_NEGOCIO != "N/I") {
                        tipoNegocioEstab.push(data.TIPO_NEGOCIO[i].TIPO_NEGOCIO);
                    }
                }
                infoEstablecimiento.tipoNegocio = tipoNegocioEstab;
                var imagenesEstab = [];
                for (var i = 0; i < data.IMAGENES.length; i++) {
                    if (data.IMAGENES[i] != "") {
                        imagenesEstab.push(data.IMAGENES[i]);
                    }
                }
                infoEstablecimiento.imagenes = imagenesEstab;
                for (var i = 0; i < data.TIPO_NEGOCIO.length; i++) {
                    if (data.TIPO_NEGOCIO[i].TIPO_NEGOCIO == 'ALMACEN') {
                        icono = "assets/imgs/markers/iconalmacenes1.png";
                        tipoNegocioDisponible.push('ALMACEN');
                    }
                    else if (data.TIPO_NEGOCIO[i].TIPO_NEGOCIO == 'CONCESIONARIOS') {
                        icono = "assets/imgs/markers/iconconcesionarios1.png";
                        tipoNegocioDisponible.push('CONCESIONARIOS');
                    }
                    else if (data.TIPO_NEGOCIO[i].TIPO_NEGOCIO == 'TALLER') {
                        icono = "assets/imgs/markers/icontalleres1.png";
                        tipoNegocioDisponible.push('TALLER');
                    }
                    else if (data.TIPO_NEGOCIO[i].TIPO_NEGOCIO == 'OTROS SERVICIOS') {
                        icono = "assets/imgs/markers/iconotrosServicios1.png";
                        tipoNegocioDisponible.push('OTROS SERVICIOS');
                    }
                }
                for (var i = 0; i < data.TIPOS_TRANSPORTE.length; i++) {
                    if (data.TIPOS_TRANSPORTE[i].TIPOS_TRANSPORTE == 'AUTOMOVILES') {
                        tipoTransporteDisponible.push('AUTOMOVILES');
                    }
                    else if (data.TIPOS_TRANSPORTE[i].TIPOS_TRANSPORTE == 'MOTOS ') {
                        tipoTransporteDisponible.push('MOTOS');
                    }
                    else if (data.TIPOS_TRANSPORTE[i].TIPOS_TRANSPORTE == 'TRANSPESADO') {
                        tipoTransporteDisponible.push('TRANSPESADO');
                    }
                    else if (data.TIPOS_TRANSPORTE[i].TIPOS_TRANSPORTE == 'ELECTRICAS') {
                        tipoTransporteDisponible.push('ELECTRICAS');
                    }
                }
                var iconIMG = {
                    url: icono,
                    size: new google.maps.Size(63, 81),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(31.5, 81)
                };
                for (var i = 0; i < tipoNegocioDisponible.length; i++) {
                    for (var h = 0; h < tipoTransporteDisponible.length; h++) {
                        if (tipoNegocioDisponible[i] == tipoEstablecimiento && tipoTransporteDisponible[h] == tipoTransporte) {
                            empty = false;
                            _this.addMarker(location, _this.map, iconIMG, infoEstablecimiento);
                        }
                    }
                }
            });
            if (empty == true) {
                _this.showAlert("Error", "No existen Resultados para su busqueda.");
                _this.deleteMarkers();
            }
            else if (_this.markers != null || _this.markers.length != 0) {
                _this.setMapOnAll(_this.map);
            }
            else {
                _this.deleteMarkers();
            }
        });
        this.showTipoTransporte = true;
        this.showTipoServicios = false;
        this.ciudadesSel = false;
        this.showServicios = false;
    };
    HomePage.prototype.getCiudadPosicionActual = function (latitud, longitud) {
        this.geolocation.getCurrentPosition().then(function (position) {
            var latLng = new google.maps.LatLng(latitud, longitud);
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'latLng': latLng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0] != undefined) {
                        var address_component = results;
                        var itemRoute = '';
                        var itemLocality = '';
                        var itemCountry = '';
                        var itemPc = '';
                        var itemSnumber = '';
                        var i;
                        // iterate through address_component array
                        for (i = 0; i < address_component.length; i++) {
                            console.log('address_component:' + i);
                            if (address_component[i].types[0] == "administrative_area_level_1") {
                                console.log(i + ": city:" + address_component[i].formatted_address);
                                //localStorage.setItem("ciudadPosicionActual", address_component[i].formatted_address);
                            }
                        }
                        ;
                    }
                }
            });
        }, function (err) {
            console.log(err);
        });
    };
    HomePage.prototype.ubicarPosicionCiudad = function (latitud, longitud) {
        var _this = this;
        this.geolocation.getCurrentPosition().then(function (position) {
            var latLng = new google.maps.LatLng(latitud, longitud);
            _this.user.setMap(_this.map);
            _this.user.setPosition(latLng);
            _this.map.panTo(latLng);
        }, function (err) {
            console.log(err);
        });
    };
    HomePage.prototype.getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    };
    HomePage.prototype.deg2rad = function (deg) {
        return deg * (Math.PI / 180);
    };
    HomePage.prototype.showAlert = function (titulo, subtitulo) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: subtitulo,
            buttons: ['OK']
        });
        alert.present();
    };
    HomePage.prototype.ubicarPosicionEnMapa = function () {
        var _this = this;
        this.presentLoadingCustom();
        this.geolocation.getCurrentPosition().then(function (position) {
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var latIniUser = latLng.lat();
            var lngIniUser = latLng.lng();
            _this.user.setMap(_this.map);
            _this.user.setPosition(latLng);
            _this.map.panTo(latLng);
            _this.getCiudadPosicionActual(latIniUser, lngIniUser);
            _this.ObtenerEstablecimientos("", latIniUser, lngIniUser);
            _this.loaderBuscandoRunner.dismiss();
        }, function (err) {
            alert(err);
            console.log(err);
        });
    };
    HomePage.prototype.showMap = function () {
        var _this = this;
        // ubicacion
        var location = new google.maps.LatLng(localStorage.getItem("posicionInicialLat"), localStorage.getItem("posicionInicialLng"));
        //Opciones de mapa
        var options = {
            center: location,
            zoom: 16,
            streetViewControl: true,
            mapTypeId: 'roadmap',
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            rotateControl: false,
            fullscreenControl: false
        };
        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
        this.user = new google.maps.Marker({
            map: this.map,
            position: location,
            draggable: false
        });
        localStorage.setItem("map", this.map);
        setTimeout(function () { return _this.map.setMapTypeId('terrain'); }, 3000);
    };
    HomePage.prototype.addMarker = function (position, map, icon, infoEstablecimiento) {
        var _this = this;
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: icon,
            nombre: infoEstablecimiento.nombre
        });
        google.maps.event.addListener(marker, 'click', function () {
            //infoWindow.open(this.map, marker);
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__pages_info_empresas_info_empresas__["a" /* InfoEmpresasPage */], infoEstablecimiento);
        });
        this.markers.push(marker);
    };
    HomePage.prototype.buscarEstablecimientos = function () {
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].nombre.indexOf(this.textSearch) > -1) {
                this.markers[i].setMap(this.map);
            }
            else {
                this.markers[i].setMap(null);
            }
        }
    };
    HomePage.prototype.deleteMarkers = function () {
        this.setMapOnAll(null);
        this.markers = [];
    };
    HomePage.prototype.setMapOnAll = function (map) {
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
    };
    HomePage.prototype.tipoTransporte = function (tipoTransporte) {
        this.showTipoServicios = true;
        this.showTipoTransporte = false;
        localStorage.setItem("tipoTransporte", tipoTransporte);
    };
    HomePage.prototype.cerrar = function (cerrar) {
        this.deleteMarkers();
        this.showServicios = cerrar;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('map'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], HomePage.prototype, "mapRef", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('textSearch'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], HomePage.prototype, "textSearch", void 0);
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/Users/gustavovargas/Documents/workspace/ProyectosJava/sedesvarafirebase/src/pages/home/home.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu" class="menu">\n      </ion-icon>\n    </button>\n    <ion-title style="text-align:center;">\n      <img class="logoSuperior" src="assets/imgs/seDesvaraTexto.png">\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n  <!--div >\n      <div class="filtro" (click)="cerrar(true);"> <button  (click)=\'registro();\' class="boton">Paute con nosotros</button> <ion-icon name="switch" style="font-size: 3em; position: absolute; left: 25%; bottom: 5%;"></ion-icon></div>\n  </div-->\n    \n  <div id="banner">\n      <ion-list style="margin:0; width: 100% !important; padding:  0 !important;">\n        <ion-item style="margin:0; padding: 0; width: 100% !important;">\n            <div (click)="getPublicidadInfo(idPublicidad);" id="{{idPublicidad}}" style="width: 100%; width: 100% !important; text-align: center"><img src="{{urlPublicidad}}"></div>\n        </ion-item>\n      </ion-list>\n  </div>\n  <div #map id="map"></div>\n  <ion-icon *ngIf="true" style="position: absolute;right: 14px;top:4em; cursor:pointer;margin-top: 0.2em;font-size: 2em;color: black;" name="locate" (click)=\'ubicarPosicionEnMapa();\'></ion-icon>\n  <ion-grid *ngIf="buscar">\n    <ion-row>\n      <ion-col col-6>\n          <ion-input [(ngModel)]="textSearch" (keypress)="buscarEstablecimientos($event)" class="slide-in-both-ways buscarTexto"></ion-input>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n  <ion-grid>\n      <ion-row>\n        <ion-col col-3 class="filtroPais" tappable (click)="mostrarBuscar();" style="height: 3.5em; display: inherit;">\n            <ion-icon name="search" style="font-size: 2em; position: absolute; left: 30%; bottom: 20%;"></ion-icon>\n        </ion-col>\n        <ion-col col-6>\n            <a style="text-align: center;" href="http://www.sedesvara.com/asesor1.php" class="boton">Paute con nosotros</a>\n        </ion-col>\n        <ion-col col-3 class="filtro" tappable (click)="cerrar(true);" style="height: 3.5em; display: inherit;">\n            <ion-icon name="options" style="font-size: 2.2em; position: absolute; left: 20%; bottom: 15%;"></ion-icon>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n\n  <div *ngIf="showServicios" class="servicios">  \n\n    <ion-grid *ngIf="showTipoTransporte">\n      <ion-row>\n        <ion-col col-6 tappable (click)="tipoTransporte(\'TRANSPESADO\');">\n          <img class="imgServicio" id="imgRunapp"  src="assets/imgs/icons/iconcamiones.png">\n          <h4 class="tituloServicio">Transporte Pesado</h4>\n        </ion-col>\n        <ion-col col-6 tappable (click)="tipoTransporte(\'AUTOMOVILES\');">\n          <img class="imgServicio" id="imgEnvio" src="assets/imgs/icons/iconautomoviles.png">\n          <h4 class="tituloServicio">Automoviles</h4>\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-6 tappable (click)="tipoTransporte(\'MOTOS\');">\n          <img class="imgServicio" id="imgTiempo" src="assets/imgs/icons/iconmotos.png">\n          <h4 class="tituloServicio">Motocicletas</h4>\n        </ion-col>\n        <ion-col col-6 tappable (click)="tipoTransporte(\'ELECTRICAS\');">\n          <img class="imgServicio" id="imgTiempo" src="assets/imgs/icons/iconelectricas.png">\n          <h4 class="tituloServicio">Electricas</h4>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n\n    <ion-grid *ngIf="showTipoServicios">\n      <ion-row>\n        <ion-col col-6 tappable (click)="tipoEstablecimiento(\'TALLER\');">\n          <img src="assets/imgs/icons/icontalleres.png">\n          <h4 class="tituloServicio">Talleres</h4>\n        </ion-col>\n        <ion-col col-6 tappable (click)="tipoEstablecimiento(\'CONCESIONARIOS\');">\n          <img src="assets/imgs/icons/iconconcesionario.png">\n          <h4 class="tituloServicio">Concesionarios</h4>\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-6 tappable (click)="tipoEstablecimiento(\'ALMACEN\');">\n          <img src="assets/imgs/icons/iconalmacenes.png">\n          <h4 class="tituloServicio">Almacenes</h4>\n        </ion-col>\n        <ion-col col-6 tappable (click)="tipoEstablecimiento(\'OTROS SERVICIOS\');">\n          <img src="assets/imgs/icons/iconservicios.png">\n          <h4 class="tituloServicio">Otros Servicios</h4>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n  </div>\n\n  <div *ngIf="ciudadesSel" class="servicios">\n    <ion-grid>\n      <ion-row style="text-align:center; width: 100%;">\n        <ion-col col-12>\n            <ion-list>\n              <ion-item style="border-bottom: 1px solid #4d87c0; margin: 0; cursor: pointer; background-color: #4d87c0;">\n                  <div tappable (click)="ubicarPosicionEnMapa();" style="width: 100%; text-align: center;"><h6 style="font-weight: lighter; font-size: 1em; display:inline-block; color:white !important;"><a style="color:white !important;">Utilizar Ubicación Actual</a></h6></div>\n              </ion-item>\n            </ion-list>\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <h4 class="tituloServicio" style="background-color: white;">Realiza la busqueda de establecimientos en otras ciudades.</h4>\n      </ion-row>\n      <ion-row>\n          <ion-col col-12>\n              <ion-list *ngFor="let srv of ciudades | async" style="margin:0;">\n                <ion-item style="border-bottom: 1px solid #4d87c0; margin: 0; cursor: pointer;">\n                    <div tappable (click)="ubicarPosicionCiudad(srv.latitud, srv.longitud); ObtenerEstablecimientos(srv.Nombre, \'\', \'\')" style="width: 100%; text-align: center"><h6 style="font-weight: lighter; font-size: 1em; display:inline-block"><a>{{srv.Nombre}}</a></h6></div>\n                </ion-item>\n              </ion-list>\n          </ion-col>\n      </ion-row>\n    </ion-grid>\n  </div>\n  <ion-slides *ngIf="slidesPub" class="carrouselPublicidad">\n    <ion-slide *ngFor="let srv of slidesPublicidad" class="slidePublicidad">\n        <ion-icon class="cerrarCarruselas" name="close" tappable (click)=\'cerrarCarrusel();\'></ion-icon>\n        <img style="width: 100% !important; margin: 0;" src="{{srv.src}}">\n    </ion-slide>\n  </ion-slides>\n</ion-content>\n'/*ion-inline-end:"/Users/gustavovargas/Documents/workspace/ProyectosJava/sedesvarafirebase/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3_angularfire2_firestore__["a" /* AngularFirestore */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1__ionic_native_diagnostic__["a" /* Diagnostic */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContactoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the ContactoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ContactoPage = (function () {
    function ContactoPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    ContactoPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ContactoPage');
    };
    ContactoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-contacto',template:/*ion-inline-start:"/Users/gustavovargas/Documents/workspace/ProyectosJava/sedesvarafirebase/src/pages/contacto/contacto.html"*/'<ion-header>\n    <ion-navbar>\n      <button ion-button menuToggle>\n        <ion-icon name="menu" class="menu">\n        </ion-icon>\n      </button>\n      <ion-title style="text-align:center;">\n        <img class="logoSuperior" src="assets/imgs/seDesvaraTexto.png">\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n\n\n<ion-content class="no-scroll" padding>\n\n    <a href="https://api.whatsapp.com/send?phone=3115854506" class="important"><img style="max-width: 20%; margin-top:2em; right: 40%; position: absolute;" src="assets/imgs/icons/whatsappIcon.png"></a>\n    <h4 style="margin-top:6em; text-align: center;">Contacta con nosotros y te brindaremos soporte desde WhatsApp, para resolver cualquier duda o inquietud.</h4>\n</ion-content>\n'/*ion-inline-end:"/Users/gustavovargas/Documents/workspace/ProyectosJava/sedesvarafirebase/src/pages/contacto/contacto.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */]])
    ], ContactoPage);
    return ContactoPage;
}());

//# sourceMappingURL=contacto.js.map

/***/ }),

/***/ 126:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InfoEmpresasPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_firestore__ = __webpack_require__(46);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var contaPautas = 0;
var InfoEmpresasPage = (function () {
    function InfoEmpresasPage(navCtrl, navParams, db) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.db = db;
        this.publicidad = [];
        this.slidesPublicidad = [];
        this.showCarrousel = false;
        this.nombreParams = navParams.get('nombre');
        this.telefonoParams = navParams.get('telefono');
        this.direccionParams = navParams.get('direccion');
        this.serviciosParams = navParams.get('servicios');
        this.facebookParams = navParams.get('facebook');
        this.instagramParams = navParams.get('instagram');
        this.twitterParams = navParams.get('twitter');
        this.tipoNegocioParams = navParams.get('tipoNegocio');
        this.imagenesParams = navParams.get('imagenes');
        this.imagenParams = navParams.get('imagen');
        this.obtenerPublicidad();
    }
    InfoEmpresasPage.prototype.ngOnInit = function () {
        this.cargarInfoEst();
    };
    InfoEmpresasPage.prototype.cargarInfoEst = function () {
        var redes1 = [];
        if (this.facebookParams != "N/I") {
            redes1.push({ "url": this.facebookParams, "img": "assets/imgs/redesSociales/face-icon.png" });
        }
        if (this.instagramParams != "N/I") {
            redes1.push({ "url": this.instagramParams, "img": "assets/imgs/redesSociales/insta-icon.png" });
        }
        if (this.twitterParams != "N/I") {
            redes1.push({ "url": this.twitterParams, "img": "assets/imgs/redesSociales/twet-icon.png" });
        } /*else if(this.youtube.nativeElement != ""){
            redes = redes + "<a href='{{instagram}}'><img src='assets/imgs/redesSociales/youtube-icon.png'/></a>"
        }*/
        this.redesEmpresaT = redes1;
        var tiposNegocio = [];
        for (var i = 0; i < this.tipoNegocioParams.length; i++) {
            if (this.tipoNegocioParams[i] == "ALMACEN") {
                tiposNegocio.push({ "img": "assets/imgs/markers/iconalmacenes.png" });
            }
            if (this.tipoNegocioParams[i] == "TALLER") {
                tiposNegocio.push({ "img": "assets/imgs/markers/icontalleres.png" });
            }
            if (this.tipoNegocioParams[i] == "CONCESIONARIOS") {
                tiposNegocio.push({ "img": "assets/imgs/markers/iconconcesionarios.png" });
            }
            if (this.tipoNegocioParams[i] == "OTROS SERVICIOS") {
                tiposNegocio.push({ "img": "assets/imgs/markers/iconotrosServicios.png" });
            }
        }
        this.tipoNegocioEst = tiposNegocio;
        var imagenesEst = [];
        for (var i = 0; i < this.imagenesParams.length; i++) {
            if (this.imagenesParams[i].IMAGENES != "N/I") {
                imagenesEst.push({ "img": this.imagenesParams[i].IMAGENES });
            }
        }
        if (imagenesEst.length == 0) {
            this.showServiciosAdicionales = false;
        }
        else {
            this.showServiciosAdicionales = true;
            this.imagenesEstablecimiento = imagenesEst;
        }
        this.nombre = this.nombreParams;
        this.telefono = this.telefonoParams;
        this.direccion = this.direccionParams;
        this.servicios = this.serviciosParams;
        this.tipoNegocio = this.tipoNegocioParams;
        this.imagen = this.imagenParams;
    };
    InfoEmpresasPage.prototype.mostrarFotos = function () {
        this.showCarrousel = true;
    };
    InfoEmpresasPage.prototype.cerrarCarrusel = function () {
        this.showCarrousel = false;
    };
    InfoEmpresasPage.prototype.cerrarCarruselPub = function () {
        this.slidesPub = false;
    };
    InfoEmpresasPage.prototype.obtenerPublicidad = function () {
        var _this = this;
        this.publicidades = this.db.collection('publicidad', function (ref) {
            return ref.where('Estado', '==', "Activo");
        });
        this.publicidadesObservable = this.publicidades.snapshotChanges();
        var i = 0;
        this.publicidadesObservable.forEach(function (este) {
            este.forEach(function (esteData) {
                var data = esteData.payload.doc.data();
                var id = esteData.payload.doc.id;
                _this.publicidad.push({ "data": data, "id": id });
            });
        });
        setInterval(function () {
            if (contaPautas >= _this.publicidad.length) {
                contaPautas = 0;
            }
            _this.urlPublicidad = _this.publicidad[contaPautas].data.url;
            _this.idPublicidad = _this.publicidad[contaPautas].id;
            contaPautas++;
        }, 5000);
    };
    InfoEmpresasPage.prototype.getPublicidadInfo = function (idPublicidad) {
        var i;
        // iterate through address_component array
        for (i = 0; i < this.publicidad.length; i++) {
            if (this.publicidad[i].id == idPublicidad) {
                this.slidesPublicidad = this.publicidad[i].data.imagenesPublicidad;
                this.slidesPub = true;
                break;
            }
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('nombre'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], InfoEmpresasPage.prototype, "nombre", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('telefono'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], InfoEmpresasPage.prototype, "telefono", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('direccion'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], InfoEmpresasPage.prototype, "direccion", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('servicios'),
        __metadata("design:type", String)
    ], InfoEmpresasPage.prototype, "servicios", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('facebook'),
        __metadata("design:type", String)
    ], InfoEmpresasPage.prototype, "facebook", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('instagram'),
        __metadata("design:type", String)
    ], InfoEmpresasPage.prototype, "instagram", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('twitter'),
        __metadata("design:type", String)
    ], InfoEmpresasPage.prototype, "twitter", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('tipoNegocio'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], InfoEmpresasPage.prototype, "tipoNegocio", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('imagen'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], InfoEmpresasPage.prototype, "imagen", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('redesEmpresaT'),
        __metadata("design:type", Array)
    ], InfoEmpresasPage.prototype, "redesEmpresaT", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('tipoNegocioEst'),
        __metadata("design:type", Array)
    ], InfoEmpresasPage.prototype, "tipoNegocioEst", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('imagenesEstablecimiento'),
        __metadata("design:type", Array)
    ], InfoEmpresasPage.prototype, "imagenesEstablecimiento", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('serviciosEstablecimiento'),
        __metadata("design:type", Array)
    ], InfoEmpresasPage.prototype, "serviciosEstablecimiento", void 0);
    InfoEmpresasPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-info-empresas',template:/*ion-inline-start:"/Users/gustavovargas/Documents/workspace/ProyectosJava/sedesvarafirebase/src/pages/info-empresas/info-empresas.html"*/'<ion-header>\n    <ion-navbar>\n      <button ion-button menuToggle>\n        <ion-icon name="menu" class="menu">\n        </ion-icon>\n      </button>\n      <ion-title style="text-align:center;">\n        <img class="logoSuperior" src="assets/imgs/seDesvaraTexto.png">\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n\n<ion-content padding>\n    <div id="banner">\n      <ion-list style="margin:0; width: 100% !important; padding:  0 !important;">\n        <ion-item style="margin:0; padding: 0; width: 100% !important;">\n            <div (click)="getPublicidadInfo(idPublicidad);" id="{{idPublicidad}}" style="width: 100%; width: 100% !important; text-align: center"><img src="{{urlPublicidad}}"></div>\n        </ion-item>\n      </ion-list>\n  </div>\n    <ion-grid style="overflow: overlay;">\n        <ion-row class="infoEmpresaDiv">\n            <ion-col col-11>\n                <ion-label style="color: #26668c; font-size: 1.4em;margin:0;">{{nombre}}</ion-label>\n                <ion-grid>\n                    <ion-row>\n                        <ion-col col-4 class="infoEmpresaDiv" style="height: 6em; display: inherit;">\n                            <img src="{{imagen}}"/>  \n                        </ion-col>\n                        <ion-col col-8>\n                            <ion-label class="textoCaracterEmpresa">Teléfono: {{telefono}}</ion-label>\n                            <ion-label class="textoCaracterEmpresa">Dirección: {{direccion}}</ion-label>\n                            <ion-label class="textoCaracterEmpresa">Servicios: {{servicios}}</ion-label>\n                            <div class="redesEmpresa">\n                                <a *ngFor="let red of redesEmpresaT;" href="{{red.url}}"><img src="{{red.img}}"/></a>\n                            </div>\n                        </ion-col>\n                      </ion-row>\n                </ion-grid>  \n            </ion-col>\n            <ion-col col-1>\n                <a *ngFor="let tipNeg of tipoNegocioEst;"><img src="{{tipNeg.img}}"/></a>\n            </ion-col>\n            <ion-col col-12 *ngIf="showServiciosAdicionales">\n                <ion-grid>\n                    <ion-label style="margin-bottom:1em;" class="textoCaracterEmpresa">Servicios Adicionales</ion-label>\n                    <ion-row>\n                        <ion-col col-3 class="infoEmpresaDiv" *ngFor="let imgEst of imagenesEstablecimiento;" tappable (click)="mostrarFotos()" style="height: 6em; display: inherit;">\n                            <img src="{{imgEst.img}}"/>  \n                        </ion-col>\n                    </ion-row>\n                </ion-grid>\n            </ion-col>\n          </ion-row>\n    </ion-grid>\n    <!--ion-slides *ngIf="showCarrousel" class="carrousel">\n        <ion-slide *ngFor="let imgEst of imagenesEstablecimiento;" class="slide">\n            <ion-icon  class="cerrarCarruselas" name="close" tappable (click)=\'cerrarCarrusel();\'></ion-icon>\n            <img src="{{imgEst.img}}">\n        </ion-slide>\n    </ion-slides-->\n    <ion-slides *ngIf="slidesPub" class="carrouselPublicidad">\n        <ion-slide *ngFor="let srv of slidesPublicidad" class="slidePublicidad">\n            <ion-icon class="cerrarCarruselas" name="close" tappable (click)=\'cerrarCarruselPub();\'></ion-icon>\n            <img style="width: 100% !important; margin: 0;" src="{{srv.src}}">\n        </ion-slide>\n    </ion-slides>\n</ion-content>\n'/*ion-inline-end:"/Users/gustavovargas/Documents/workspace/ProyectosJava/sedesvarafirebase/src/pages/info-empresas/info-empresas.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2_angularfire2_firestore__["a" /* AngularFirestore */]])
    ], InfoEmpresasPage);
    return InfoEmpresasPage;
}());

//# sourceMappingURL=info-empresas.js.map

/***/ }),

/***/ 127:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegistroPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_sqlite__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angularfire2_firestore__ = __webpack_require__(46);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var RegistroPage = (function () {
    function RegistroPage(navCtrl, navParams, alertCtrl, loadingCtrl, afs, platform, sqlite, geolocation) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.afs = afs;
        this.platform = platform;
        this.sqlite = sqlite;
        this.geolocation = geolocation;
        this.objDataBase = null;
        //Garantiza que los modulos de la applicacion esten
        //cargados antes de llamar al plugin de BD
        //SP
        this.platform.ready().then(function () {
            _this.CreatedataBase();
            setTimeout(function () {
                _this.getInfoFromDB();
            }, 3000);
        });
        this.usuariosCollection = this.afs.collection('usuarios');
        this.getUbicacion();
    }
    RegistroPage.prototype.getUbicacion = function () {
        this.geolocation.getCurrentPosition().then(function (position) {
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var latIniUser = latLng.lat();
            var lngIniUser = latLng.lng();
            localStorage.setItem("posicionInicialLat", latIniUser);
            localStorage.setItem("posicionInicialLng", lngIniUser);
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'latLng': latLng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0] != undefined) {
                        var address_component = results;
                        var itemRoute = '';
                        var itemLocality = '';
                        var itemCountry = '';
                        var itemPc = '';
                        var itemSnumber = '';
                        var i;
                        // iterate through address_component array
                        for (i = 0; i < address_component.length; i++) {
                            console.log('address_component:' + i);
                            if (address_component[i].types[0] == "administrative_area_level_1") {
                                console.log(i + ": city:" + address_component[i].formatted_address);
                                localStorage.setItem("ciudad", address_component[i].formatted_address);
                            }
                        }
                        ;
                    }
                }
            });
        }, function (err) {
            console.log(err);
        });
    };
    //Metodos Base de Datos
    RegistroPage.prototype.getInfoFromDB = function () {
        var _this = this;
        if (this.objDataBase != null) {
            this.objDataBase.executeSql('SELECT nombre, email, telefono  FROM user', {})
                .then(function (res) {
                if (res.rows.length > 0) {
                    _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */]);
                    //alert(username + " >>>> " + password );
                }
            });
        }
    };
    RegistroPage.prototype.CreatedataBase = function () {
        var _this = this;
        this.sqlite.create({
            name: 'sedesvara.db',
            location: 'default'
        }).then(function (db) {
            db.executeSql('CREATE TABLE IF NOT EXISTS user(rowid INTEGER PRIMARY KEY, nombre TEXT, email TEXT, telefono NUMBER)', {})
                .catch(function (e) { }); //alert(e));
            _this.objDataBase = db;
            _this.getInfoFromDB();
        }).catch(function (e) { } //alert(e)
        );
    };
    RegistroPage.prototype.saveUserName_Password = function () {
        var _this = this;
        this.presentLoadingCustom();
        if (this.nombre != undefined || this.email != undefined || this.telefono != undefined) {
            var Usuario = {
                nombre: this.nombre,
                email: this.email,
                telefono: this.telefono,
                ciudad: localStorage.getItem("ciudad")
            };
            this.usuariosCollection.add(Usuario).then(function (_ref) {
                _ref.onSnapshot(function (docSnapshot) {
                    if (docSnapshot != null) {
                        _this.loaderBuscandoRunner.dismiss();
                        _this.showAlert("Confirmación", "Se creó correctamente el registro");
                        setTimeout(function () {
                            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */]);
                        }, 2000);
                    }
                });
            });
            if (this.objDataBase != null) {
                this.objDataBase.executeSql('delete from user', {});
                this.objDataBase.executeSql('INSERT INTO user VALUES(NULL,?,?,?)', [this.nombre, this.email, this.telefono])
                    .then(function (res) {
                    //this.showAlert("Error","Usuario Registrado");
                    //this.registrarUsuario(nombre, email, telefono);
                    //this.toast.show('Data saved', '5000', 'center').subscribe(
                    //  toast => {
                    //    this.navCtrl.popToRoot();
                    //  }
                    //);
                })
                    .catch(function (e) {
                    _this.showAlert("Error", "Se presento un error al registrar el Usuario");
                    //alert(e);
                    //this.toast.show(e, '5000', 'center').subscribe(
                    //  toast => {
                    //    alert(toast);
                    //  }
                    // );
                });
            }
        }
        else {
            this.loaderBuscandoRunner.dismiss();
            this.showAlert("Error", "Es muy importante para nosotros conocerte, por favor diligencia la información una única vez.");
        }
    };
    RegistroPage.prototype.showAlert = function (titulo, subtitulo) {
        var alert = this.alertCtrl.create({
            title: titulo,
            subTitle: subtitulo,
            buttons: ['OK']
        });
        alert.present();
    };
    RegistroPage.prototype.presentLoadingCustom = function () {
        this.loaderBuscandoRunner = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: "Cargando..."
            //,duration: 2000
        });
        this.loaderBuscandoRunner.present();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('nombre'),
        __metadata("design:type", String)
    ], RegistroPage.prototype, "nombre", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('email'),
        __metadata("design:type", String)
    ], RegistroPage.prototype, "email", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('telefono'),
        __metadata("design:type", String)
    ], RegistroPage.prototype, "telefono", void 0);
    RegistroPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-registro',template:/*ion-inline-start:"/Users/gustavovargas/Documents/workspace/ProyectosJava/sedesvarafirebase/src/pages/registro/registro.html"*/'<!--\n  Generated template for the PaginaInicioPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n\n\n\n<ion-content class="contenido" padding>\n\n    <img src="assets/imgs/seDesvaraTexto.png"/>\n    <div style="margin-top: 50%;">\n      <ion-item >\n        <ion-input class="registroTexto" type="text" placeholder="Nombre y Apellido" [(ngModel)]="nombre" name="nombre"  required></ion-input>\n      </ion-item>\n      <ion-item>\n        <ion-input class="registroTexto" type="email" placeholder="Correo Electronico" [(ngModel)]="email" name="email"  required></ion-input>\n      </ion-item>\n      <ion-item>\n        <ion-input class="registroTexto" type="number" placeholder="Teléfono" [(ngModel)]="telefono" name="telefono"  required></ion-input>\n      </ion-item>\n\n      <ion-item>\n        <ion-label style="color: #26668c; text-align:center; font-size: 1.1em;">Aceptar términos y condiciones.</ion-label>\n        <ion-checkbox color="#26668c;" checked="true"></ion-checkbox>\n      </ion-item>\n\n      <button  (click)=\'saveUserName_Password();\' class="boton">Ingresar</button>\n    </div>\n  </ion-content>'/*ion-inline-end:"/Users/gustavovargas/Documents/workspace/ProyectosJava/sedesvarafirebase/src/pages/registro/registro.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_5_angularfire2_firestore__["a" /* AngularFirestore */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_sqlite__["a" /* SQLite */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */]])
    ], RegistroPage);
    return RegistroPage;
}());

//# sourceMappingURL=registro.js.map

/***/ }),

/***/ 137:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 137;

/***/ }),

/***/ 181:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/contacto/contacto.module": [
		377,
		5
	],
	"../pages/info-empresas/info-empresas.module": [
		378,
		4
	],
	"../pages/login/login.module": [
		379,
		0
	],
	"../pages/pagina-inicio/pagina-inicio.module": [
		380,
		3
	],
	"../pages/registro/registro.module": [
		381,
		2
	],
	"../pages/terminos/terminos.module": [
		382,
		1
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 181;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 251:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PaginaInicioPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pages_registro_registro__ = __webpack_require__(127);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Generated class for the PaginaInicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PaginaInicioPage = (function () {
    function PaginaInicioPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    PaginaInicioPage.prototype.registro = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__pages_registro_registro__["a" /* RegistroPage */]);
    };
    PaginaInicioPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PaginaInicioPage');
    };
    PaginaInicioPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-pagina-inicio',template:/*ion-inline-start:"/Users/gustavovargas/Documents/workspace/ProyectosJava/sedesvarafirebase/src/pages/pagina-inicio/pagina-inicio.html"*/'<!--\n  Generated template for the PaginaInicioPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n\n\n\n<ion-content class="contenido" padding>\n\n  <img src="assets/imgs/sedesvara-logo-grande.png"/>\n  <div style="margin-top: 75%;">\n    <h4 style="color: #26668c; text-align:center; font-size: 1.3em;">Encuentre aquí todo el mundo automotriz <br>en todo el país.</h4>\n    <h4 style="color: #26668c; text-align:center; font-size: 1.1em;">AUTOS - MOTOS - CUATRIMOTOS - TRANSPORTE PESADO - BICI - MOTOS ELÉCTRICAS.</h4>\n    <button  (click)=\'registro();\' class="boton">Continuar</button>\n    <div class="redes">\n        <a href="https://www.facebook.com/SeDesvara/"><img src="assets/imgs/redesSociales/face-icon.png"/></a>\n        <a href="https://www.instagram.com/sedesvara/"><img src="assets/imgs/redesSociales/insta-icon.png"/></a>\n        <a href="https://twitter.com/sedesvara"><img src="assets/imgs/redesSociales/twet-icon.png"/></a>\n        <a href="https://www.youtube.com/channel/UCbXJus0IHf8adofXH_4zvNA"><img src="assets/imgs/redesSociales/youtube-icon.png"/></a>\n      </div>\n  </div>\n</ion-content>\n'/*ion-inline-end:"/Users/gustavovargas/Documents/workspace/ProyectosJava/sedesvarafirebase/src/pages/pagina-inicio/pagina-inicio.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */]])
    ], PaginaInicioPage);
    return PaginaInicioPage;
}());

//# sourceMappingURL=pagina-inicio.js.map

/***/ }),

/***/ 252:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TerminosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_firestore__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase__ = __webpack_require__(326);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_lodash__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the TerminosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var TerminosPage = (function () {
    function TerminosPage(navCtrl, afauth, navParams, afs, http) {
        this.navCtrl = navCtrl;
        this.afauth = afauth;
        this.navParams = navParams;
        this.afs = afs;
        this.http = http;
        this.ref = __WEBPACK_IMPORTED_MODULE_5_firebase__["storage"]().ref('excel');
        this.usercreds = {
            email: '',
            password: ''
        };
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
    TerminosPage.prototype.getJsonInfo = function () {
        var _this = this;
        this.http.get('assets/data/establecimientos/datosempresa.json')
            .subscribe(function (res) { return _this.data = res.json(); });
        alert(JSON.stringify(this.data));
        this.storethis(this.data);
    };
    TerminosPage.prototype.storethis = function (somejson) {
        var _this = this;
        var a = 4265;
        return new Promise(function (resolve) {
            __WEBPACK_IMPORTED_MODULE_6_lodash__["map"](somejson, function (element, i) {
                __WEBPACK_IMPORTED_MODULE_6_lodash__["keys"](element).map(function (elementkey) {
                    _this.afs.collection('establecimientos').doc('establecimiento' + a).set(element);
                });
                a++;
            });
            resolve();
        });
    };
    TerminosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-terminos',template:/*ion-inline-start:"/Users/gustavovargas/Documents/workspace/ProyectosJava/sedesvarafirebase/src/pages/terminos/terminos.html"*/'<!--\n  Generated template for the TerminosPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>Terminos</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n\n  <button (click)="getJsonInfo()">Creeme</button>\n\n  <input type="email" placeholder="email" [(ngModel)]="usercreds.email" >\n  <input type="password" placeholder="password" [(ngModel)]="usercreds.password" >\n  <button (click)="login()">Login</button>\n\n</ion-content>\n'/*ion-inline-end:"/Users/gustavovargas/Documents/workspace/ProyectosJava/sedesvarafirebase/src/pages/terminos/terminos.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__["a" /* AngularFireAuth */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_4_angularfire2_firestore__["a" /* AngularFirestore */], __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Http */]])
    ], TerminosPage);
    return TerminosPage;
}());

//# sourceMappingURL=terminos.js.map

/***/ }),

/***/ 253:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(269);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 269:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angularfire2_auth__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_http__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_diagnostic__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_component__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_home_home__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_contacto_contacto__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_terminos_terminos__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_pagina_inicio_pagina_inicio__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_registro_registro__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_info_empresas_info_empresas__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_angularfire2_firestore__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ionic_native_geolocation__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_native_sqlite__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_angularfire2__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_angularfire2_database__ = __webpack_require__(358);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


















// Import the AF2 Module


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
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_9__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_contacto_contacto__["a" /* ContactoPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_terminos_terminos__["a" /* TerminosPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_pagina_inicio_pagina_inicio__["a" /* PaginaInicioPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_registro_registro__["a" /* RegistroPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_info_empresas_info_empresas__["a" /* InfoEmpresasPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_6__angular_http__["b" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/contacto/contacto.module#ContactoPageModule', name: 'ContactoPage', segment: 'contacto', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/info-empresas/info-empresas.module#InfoEmpresasPageModule', name: 'InfoEmpresasPage', segment: 'info-empresas', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/login/login.module#LoginPageModule', name: 'LoginPage', segment: 'login', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/pagina-inicio/pagina-inicio.module#PaginaInicioPageModule', name: 'PaginaInicioPage', segment: 'pagina-inicio', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/registro/registro.module#RegistroPageModule', name: 'RegistroPage', segment: 'registro', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/terminos/terminos.module#TerminosPageModule', name: 'TerminosPage', segment: 'terminos', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_18_angularfire2__["a" /* AngularFireModule */].initializeApp(firebaseConfig),
                __WEBPACK_IMPORTED_MODULE_19_angularfire2_database__["a" /* AngularFireDatabaseModule */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_9__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_contacto_contacto__["a" /* ContactoPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_terminos_terminos__["a" /* TerminosPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_pagina_inicio_pagina_inicio__["a" /* PaginaInicioPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_registro_registro__["a" /* RegistroPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_info_empresas_info_empresas__["a" /* InfoEmpresasPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_17__ionic_native_sqlite__["a" /* SQLite */],
                __WEBPACK_IMPORTED_MODULE_16__ionic_native_geolocation__["a" /* Geolocation */],
                __WEBPACK_IMPORTED_MODULE_15_angularfire2_firestore__["a" /* AngularFirestore */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_diagnostic__["a" /* Diagnostic */],
                __WEBPACK_IMPORTED_MODULE_5_angularfire2_auth__["a" /* AngularFireAuth */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 357:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_contacto_contacto__ = __webpack_require__(125);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */]; //PaginaInicioPage;//;
        this.pages = [
            { titulo: 'Inicio', component: __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */], icon: 'home' },
            //{titulo:'Términos y Condiciones', component:TerminosPage, icon: 'mail'},
            { titulo: 'Contacto', component: __WEBPACK_IMPORTED_MODULE_5__pages_contacto_contacto__["a" /* ContactoPage */], icon: 'information-circle' }
        ];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp.prototype.goToPage = function (page) {
        this.nav.setRoot(page);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('NAV'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/gustavovargas/Documents/workspace/ProyectosJava/sedesvarafirebase/src/app/app.html"*/'<ion-menu [content]= "NAV">\n    <ion-content>\n        <ion-list>\n            <img style="max-width: 25%;margin: 1em;border: 0; left: 35%; position: sticky;" src="assets/imgs/sedesvara-logo-grande.png">\n            <button ion-item *ngFor="let page of pages" tappable (click)="goToPage(page.component)" menuClose>\n                <ion-icon name="{{page.icon}}" item-start></ion-icon> \n                {{page.titulo}}\n            </button>\n        </ion-list>\n    </ion-content>\n</ion-menu>\n<ion-nav #NAV [root]="rootPage"></ion-nav>'/*ion-inline-end:"/Users/gustavovargas/Documents/workspace/ProyectosJava/sedesvarafirebase/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ })

},[253]);
//# sourceMappingURL=main.js.map