import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    TranslateModule,    
    RouterModule,
    Ng2SmartTableModule,
  ],
  exports: [ RouterModule ],
  declarations: [ MainComponent ]
})
export class MainModule { }