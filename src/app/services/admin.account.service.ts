import { Injectable } from '@angular/core';
import endpoints from '../app.endpoints';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AdminAccountService {

  constructor(private http: HttpClient) { }

  //account api

  public addAccountToCompanyBucket(companyId: string, bucketId: string, data:any): Observable<any> {    
      let url = `${endpoints.companyEndpoint()}/${companyId}/buckets/${bucketId}/accounts`;
      let body = {
        "name": data.name,
        "targetURL": data.targetURL,
        "accountTags": data.accountTags,
        "customAttributes":data.customAttributes,
        "dialogName": data.dialogName,
        "dialogType": data.dialogType
      }
      return this.http.post(url, body);
  }

  public getListAccountOfCompanyBucket(companyId: string, bucketId: string): Observable<any> {    
      let url = `${endpoints.companyEndpoint()}/${companyId}/buckets/${bucketId}/accounts`;
      return this.http.get(url);
  }

  public updateAccountToCompanyBucket(companyId: string, bucketId: string, accountId:string, data:any): Observable<any> {    
      let url = `${endpoints.companyEndpoint()}/${companyId}/buckets/${bucketId}/accounts/${accountId}`;
      let body = {
        "name": data.name,
        "targetURL": data.targetURL,
        "accountTags": data.accountTags,
        "customAttributes":data.customAttributes,
        "dialogName": data.dialogName,
        "dialogType": data.dialogType
      }
      return this.http.put(url, body);
  }

  public deleteAccountOfCompanyBucket(companyId: string, bucketId: string, accountId:string): Observable<any> {    
      let url = `${endpoints.companyEndpoint()}/${companyId}/buckets/${bucketId}/accounts/${accountId}`;
      return this.http.delete(url);
  }

}
