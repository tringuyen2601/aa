import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { Headers, Http, URLSearchParams,Response,RequestOptions } from '@angular/http';
//import {  client-oauth2 } from 'client-oauth2';
import { OAuthService } from 'angular2-oauth2/oauth-service';
import { HeaderService} from './header.service';
import endpoints from '../app.endpoints';
import { AuthService } from "../services/auth.service";
import { AuthComponent } from "../auth/auth.component";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [HeaderService]
})
export class HeaderComponent implements OnInit {
  public res:any;
  public displaySolution:any;
  public loggedIn = false;

  constructor(private http: Http,private router: Router,private oauthService: OAuthService,private userInfoService: HeaderService,
              private authService: AuthService) { 
    AuthComponent.change.subscribe(data => {
      if(data){
        this.loggedIn = true;
        console.log('loggedIn EventEmitter: ', data);
      }
    }, err =>{
      console.log('EventEmitter: ', err);
    });
  }
  
   public goToLogin(){
     this.loggedIn = true;
      console.log("getLoginURl: ", this.getLoginUrl());
      window.location.href=this.getLoginUrl();
  }
  public goToLogout(){
     //localStorage.removeItem("accessToken");
     this.authService.loggOut();
     this.loggedIn = false;
     window.location.href=this.getLogoutUrl();
     //this.router.navigate(['/admin-home']);
     
     //console.log("href logout", this.getLogoutUrl());
     //window.location.href= this.getLogoutUrl();
  }
  private getLoginUrl(){
    let url = `${endpoints.loginUrlEndpoint()}`;
    return url;
  };

  private getLogoutUrl(){
    let url = `${endpoints.logoutUrlEndpoint()}`;
    return url;
  };
  
  ngOnInit() {
    this.displaySolution="hideDiv";
    let url=window.location.href;
    this.loggedIn = this.authService.isLoggin();
      }

}
