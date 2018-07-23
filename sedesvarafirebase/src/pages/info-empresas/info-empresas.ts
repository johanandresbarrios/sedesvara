import { Component,ViewChild, ElementRef, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import { ElementData } from '@angular/core/src/view';

interface Publicidad{
  id?: string;
  estado: string;
  Nombre: string;
  url: string;
  latitud:string;
  longitud: string;
}

var contaPautas=0;

@IonicPage()
@Component({
  selector: 'page-info-empresas',
  templateUrl: 'info-empresas.html',
})
export class InfoEmpresasPage implements OnInit{

  @ViewChild('nombre') nombre:ElementRef;
  @ViewChild('telefono') telefono:ElementRef;
  @ViewChild('direccion') direccion:ElementRef; 
  @ViewChild('servicios') servicios:string;
  @ViewChild('facebook') facebook:string;
  @ViewChild('instagram') instagram:string; 
  @ViewChild('twitter') twitter:string;
  @ViewChild('tipoNegocio') tipoNegocio:ElementRef;
  @ViewChild('imagen') imagen:ElementRef; 

  @ViewChild('redesEmpresaT') redesEmpresaT: Array<"">; 
  @ViewChild('tipoNegocioEst') tipoNegocioEst: Array<"">; 
  @ViewChild('imagenesEstablecimiento') imagenesEstablecimiento: Array<"">; 
  @ViewChild('serviciosEstablecimiento') serviciosEstablecimiento: Array<"">; 
  
  idPublicidad: string;
  urlPublicidad: string;

  slidesPub: boolean;
  showServiciosAdicionales: boolean;
  publicidades: AngularFirestoreCollection<any>;
  publicidadesObservable: Observable<any[]>;
  
  
  showCarrousel: boolean;

  nombreParams: any;
  telefonoParams: any;
  direccionParams: any;
  serviciosParams: any;
  facebookParams: any;
  instagramParams: any;
  twitterParams: any;
  tipoNegocioParams: any;
  imagenesParams: any;
  imagenParams: any;

  publicidad = [];
  slidesPublicidad = [];
  

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFirestore) {

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

  ngOnInit(){
    this.cargarInfoEst();
  }

  cargarInfoEst(){

    var redes1 = [];

    if(this.facebookParams != "N/I"){
        redes1.push({"url":this.facebookParams, "img":"assets/imgs/redesSociales/face-icon.png"}); 
    }if(this.instagramParams != "N/I"){
        redes1.push({"url":this.instagramParams, "img":"assets/imgs/redesSociales/insta-icon.png"});
    }if(this.twitterParams != "N/I"){
        redes1.push({"url":this.twitterParams, "img":"assets/imgs/redesSociales/twet-icon.png"});  
    }/*else if(this.youtube.nativeElement != ""){
        redes = redes + "<a href='{{instagram}}'><img src='assets/imgs/redesSociales/youtube-icon.png'/></a>"
    }*/

    this.redesEmpresaT = redes1;

    var tiposNegocio = [];
    
    for (var i = 0; i < this.tipoNegocioParams.length; i++) { 
        if(this.tipoNegocioParams[i] == "ALMACEN"){
          tiposNegocio.push({"img":"assets/imgs/markers/iconalmacenes.png"});
        }if(this.tipoNegocioParams[i] == "TALLER"){
          tiposNegocio.push({"img":"assets/imgs/markers/icontalleres.png"});
        }if(this.tipoNegocioParams[i] == "CONCESIONARIOS"){
          tiposNegocio.push({"img":"assets/imgs/markers/iconconcesionarios.png"});
        }if(this.tipoNegocioParams[i] == "OTROS SERVICIOS"){
          tiposNegocio.push({"img":"assets/imgs/markers/iconotrosServicios.png"});
        }
        
    }

    this.tipoNegocioEst = tiposNegocio;

    var imagenesEst = [];
    
    for (var i = 0; i < this.imagenesParams.length; i++) { 
        if(this.imagenesParams[i].IMAGENES != "N/I"){
          imagenesEst.push({"img":this.imagenesParams[i].IMAGENES});
        }
    }

    if(imagenesEst.length == 0){
      this.showServiciosAdicionales = false;
    }else{
      this.showServiciosAdicionales = true;
      this.imagenesEstablecimiento = imagenesEst;
    }
    
    this.nombre = this.nombreParams;
    this.telefono = this.telefonoParams;
    this.direccion = this.direccionParams;
    this.servicios = this.serviciosParams;
    this.tipoNegocio = this.tipoNegocioParams;
    this.imagen = this.imagenParams;
  }

  mostrarFotos(){
    this.showCarrousel = true;
  }

  cerrarCarrusel(){
    this.showCarrousel = false;
  }

  cerrarCarruselPub(){
    this.slidesPub = false;
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
}
