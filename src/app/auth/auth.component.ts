import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { Headers, Http, URLSearchParams,Response,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { ApiService } from '../app.service';
import 'rxjs/add/operator/map';
import { AuthService } from "../services/auth.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: []
})
export class AuthComponent implements OnInit {
  public code:any;
  errorMessage: String;
  public companies:string[] = [];
  public companySelectForm: FormGroup;
  public selectedCompany:string;
  public static change: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private http: Http,private router: Router,private apiService:ApiService,private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder) {
      this.activatedRoute.queryParams.subscribe(params => {
        console.log("params",params);
        if(params!={})
        {
          this.code=params['code'];
        }
    }, err => {
      console.log('Error params: ', err);
    });
      this.selectedCompany = this.authService.getSelectedCompanyId() || "";
    }
  ngOnInit() {
   
        //init the form
          this.createCompanySelectForm();
          console.log("href", window.location.href);
          //get the code form url
          // let urlParams = this.getAllUrlParamsAsObject(window.location.href);
          // console.log("urlPArams",urlParams);
          // let code = urlParams['code'];
          // console.log('Code: ', code);
          let code=this.code;
          //get token from code
          if(code){
              this.apiService.getTokenFromCodeForKeycloak(code).subscribe(data => {
              console.log('Data from code', data);
              //store to the token/id token in local storage
              this.authService.setAccessToken(data.accessToken);
              this.authService.setIdToken(data.idToken);
              AuthComponent.change.emit(true);
              this.getCompanyList();
              }, err => {
                console.log('Error: ', err);
              });
          } else {
            this.getCompanyList();
            if(localStorage.getItem('accessToken')==''||localStorage.getItem('accessToken')==null)
                {
                      this.router.navigate(['/admin-home']);AuthComponent.change.emit(false);
                }
          }
  }

  private getCompanyList(){
    //get company list
    //select the company id
    this.authService.getUserinfo().subscribe(data => {
      //store user company info
      this.authService.setUniqueUserId(data.data.uniqueUserId);
      this.companies = data.data.groups;
      console.log('groups: ', data.data.groups);
    }, err =>{
      console.log('getUserinfo Error');
    });
  }

  //get request parameter and convert as object - IE - GETTING SYNTAX ERROR FOR the QUERY STRING DEPENDENCY
  // private getAllUrlParamsAsObject(url?): any {
  //       console.log("url",url);
  //       const queryString = require('query-string');
  //       console.log("qs",queryString);
  //       // get query string from url (optional) or window
  //       var queryStringUrl = url ? url.split('?')[1] : window.location.href.split('?')[1];

  //       console.log(queryStringUrl);

  //       const parsed = queryString.parse(queryStringUrl);

  //       return parsed;
  // }

  private createCompanySelectForm() {
    this.companySelectForm = this.formBuilder.group({
      selectedCompany: [this.selectedCompany]
    });
  }

  public onChangeCompany(companyId){
    console.log('companyId: ', companyId);
    //this.selectedCompany = companyId;
  }

  public onSubmitSelectCompany(){
    this.authService.setSelectedCompanyId(this.companySelectForm.value.selectedCompany);
    console.log('selectedCompanyId: ', this.authService.getSelectedCompanyId());
    //navigate the admin
    this.router.navigate(['/admin']);
  }

}
