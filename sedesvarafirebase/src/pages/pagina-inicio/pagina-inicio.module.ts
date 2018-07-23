import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaginaInicioPage } from './pagina-inicio';

@NgModule({
  declarations: [
    PaginaInicioPage,
  ],
  imports: [
    IonicPageModule.forChild(PaginaInicioPage),
  ],
})
export class PaginaInicioPageModule {}
