import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoEmpresasPage } from './info-empresas';

@NgModule({
  declarations: [
    InfoEmpresasPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoEmpresasPage),
  ],
})
export class InfoEmpresasPageModule {}
