import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { AdminHomeComponent } from './admin-home.component';
import { AdminHomeService } from './admin-home.service';
const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AdminHomeService]
})
export class AdminHomeRoutingModule {}

