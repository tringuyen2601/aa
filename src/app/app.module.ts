import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { OAuthService } from 'angular2-oauth2/oauth-service';
import { AppComponent } from './app.component';
// Routing Module
import { AppRoutingModule } from './app.routing';

import { ApiService } from './app.service';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//http loading indicator
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';
import { NgHttpLoaderComponentsModule } from 'ng-http-loader/components/ng-http-loader-components.module';
import { NgHttpLoaderServicesModule } from 'ng-http-loader/services/ng-http-loader-services.module';
import { SpinnerComponent } from "./shared/spinner/spinner.component";

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderService } from './header/header.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from "./confirmation-dialog/confirmation-dialog.service";
import { CoreModule } from './core/core.module';
import {AdminBucketService} from './services/admin.bucket.service';
import { AdminAccountService } from "./services/admin.account.service";
import { AdminPermissionService } from "./services/admin.permissions.service";
import { AuthService } from "./services/auth.service";
import { ConfirmationDialogComponent } from "./confirmation-dialog/confirmation-dialog.component";
import { Ng2SmartTableModule } from '../ng2-smart-table';
import { TableComponent } from './table/table.component';
import { RowComponent } from './table/row/row.component';


@NgModule({
  declarations: [
    AppComponent,
    FullLayoutComponent,
    HeaderComponent,
    FooterComponent,
    ConfirmationDialogComponent,
    SpinnerComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CoreModule,
    BrowserAnimationsModule,//=> Need this one for toarst message
    ToastrModule.forRoot({timeOut: 1000}),
    //SimpleNgTagsModule,//=>CAUSE THE ERROR HERE
    NgbModule.forRoot(),
    //http loading indicator
    NgHttpLoaderServicesModule,
    NgHttpLoaderComponentsModule,
    Ng2SmartTableModule,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  },ApiService,OAuthService,HeaderService,
    ToastrService,
    ConfirmationDialogService,
    AdminBucketService,
    AdminAccountService,
    AdminPermissionService,
    AuthService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationDialogComponent,
    SpinnerComponent
  ]
})
export class AppModule { }
