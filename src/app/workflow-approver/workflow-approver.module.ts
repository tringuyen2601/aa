import { NgModule } from '@angular/core';
import { ModalModule } from 'ng2-bootstrap';
import { WorkflowApproverComponent } from './workflow-approver.component';
import { WorkflowApproverRoutingModule } from './workflow-approver-routing.module';
import { CommonModule } from '@angular/common';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
//import { SimpleNgTagsModule } from 'simple-ng-tags';
import {AngularMultiSelectModule }from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
@NgModule({
  imports: [
      WorkflowApproverRoutingModule,
      ModalModule.forRoot(),
      CommonModule,
      MultiselectDropdownModule,
      FormsModule,
      ReactiveFormsModule ,
      //SimpleNgTagsModule,
      AngularMultiSelectModule
  ],
  declarations: [ WorkflowApproverComponent ]
})
export class WorkflowApproverModule { }
