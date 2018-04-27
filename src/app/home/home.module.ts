import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ng2-bootstrap/dropdown';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    HomeRoutingModule,
    ChartsModule,
    BsDropdownModule
  ],
  declarations: [HomeComponent ]
})
export class HomeModule { }
