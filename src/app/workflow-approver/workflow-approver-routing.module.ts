import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { WorkflowApproverComponent } from './workflow-approver.component';

const routes: Routes = [
  {
    path: '',
    component: WorkflowApproverComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowApproverRoutingModule {}
