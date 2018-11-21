import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtvcPage } from './otvc';

@NgModule({
  declarations: [
    OtvcPage,
  ],
  imports: [
    IonicPageModule.forChild(OtvcPage),
  ],
})
export class OtvcPageModule {}
