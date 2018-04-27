import { Injectable } from '@angular/core';
import endpoints from '../app.endpoints';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AuthService {

  private selectedCompanyId: string;
  private uniqueUserId: string;

  constructor(private http: HttpClient) { }

  //bucket api
  public getUserinfo(): Observable<any> {
        let url = `${endpoints.authenticationEndpoint()}/token/userinfo`;
        // Add x-auth token to header
        const headers = new HttpHeaders({
            'X-AUTH-ID-TOKEN': localStorage.getItem('idToken'),
            'IDM_PROVIDER': 'KEYCLOAK'
        });

        // Add headers to request
        const options = {
            headers: headers
        };
      return this.http.get(url, options);
  }

  public setSelectedCompanyId(selectedCompanyId: string){
      localStorage.setItem('selectedCompanyId', selectedCompanyId);
      console.log('setSelectedCompanyId: ', localStorage.getItem('selectedCompanyId'));
  }

  public getSelectedCompanyId():string{
      let companyId = localStorage.getItem('selectedCompanyId');
      if(companyId != ''&& companyId != null){
          return companyId.split('_')[0];
      }
      return '';
  }

  public setUniqueUserId(uniqueUserId){
      localStorage.setItem('uniqueUserId', uniqueUserId);
  }

  public getUniqueUserId():string{
      return localStorage.getItem('uniqueUserId');
  }

  public setAccessToken(accessToken){
      localStorage.setItem('accessToken', accessToken);
  }

  public getAccessToken():string{
      return localStorage.getItem('accessToken');
  }

  public setIdToken(idToken){
      localStorage.setItem('idToken', idToken);
  }

  public getIdToken():string{
      return localStorage.getItem('idToken');
  }

  public isLoggin():boolean{
       let t=(this.getAccessToken() != ''&&this.getAccessToken() != null) && (this.getIdToken() != ''&&this.getIdToken() != null);
       console.log("isloggin condn",t);
      return (this.getAccessToken() != ''&&this.getAccessToken() != null) && (this.getIdToken() != ''&&this.getIdToken() != null);
  }

  public loggOut(){
      this.setAccessToken('');
      this.setIdToken('');
  }
}
