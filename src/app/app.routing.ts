import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
export const routes: Routes = [
   {
    path: '',
    redirectTo: 'admin-home',
    pathMatch: 'full',
   },
  {
    path: '',
    component: FullLayoutComponent,
    children: [
        {
          path: 'auth',
          loadChildren: './auth/auth.module#AuthModule'
        },
        {
          path: 'admin-home',
          loadChildren: './admin-home/admin-home.module#AdminHomeModule'
        },
        {
          path: 'admin',
          loadChildren: './admin/admin.module#AdminModule'
        },
        {
          path: 'home',
          loadChildren: './home/home.module#HomeModule'
        },
        {
          path:'workflow-approver',//=> Check with layout
          loadChildren:'./workflow-approver/workflow-approver.module#WorkflowApproverModule'
        }
      ]
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:false})],
  exports: [RouterModule]
})
export class AppRoutingModule {}