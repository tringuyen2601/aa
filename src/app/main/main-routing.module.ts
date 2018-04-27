import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { MainComponent } from './main.component';
import { MainService } from './main.service';
const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    // children: [
    //   {
    //     path: '',
    //     redirectTo: 'order-type-selection',
    //     pathMatch: 'full',
    //   },
    //   {
    //     path :'order-type-selection',
    //     component: OrderTypeSelectionComponent,
    //     data: {
    //       title: "Order Type Selection"
    //     },
    //   }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [MainService]
})
export class MainRoutingModule {}
