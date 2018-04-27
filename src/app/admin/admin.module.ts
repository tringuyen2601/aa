import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
//import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2SmartTableModule } from '../../ng2-smart-table';
import { TableComponent } from '../table/table.component';
//import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { FieldErrorDisplayComponent } from "../field-error-display/field-error-display.component";
import { ModalModule } from 'ng2-bootstrap/modal';
import { BucketsComponent } from "./buckets/buckets.component";
import { AccountsComponent } from "./accounts/accounts.component";
import { PermissionComponent } from "./permission/permission.component";
//tree menu
import {TreeModule} from 'primeng/tree';
import { RowComponent } from '../table/row/row.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ModalModule.forRoot(),
    TreeModule
  ],
  declarations: [ AdminComponent,
    BucketsComponent,
    AccountsComponent,
    PermissionComponent,
  //ConfirmationDialogComponent,
    FieldErrorDisplayComponent,
    TableComponent,
    RowComponent
  ],
  entryComponents: [
    BucketsComponent,
    AccountsComponent,
    PermissionComponent
    //ConfirmationDialogComponent
  ],
  providers: [
  ]
})
export class AdminModule { }
