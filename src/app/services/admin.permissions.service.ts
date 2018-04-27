import { Injectable } from '@angular/core';
import endpoints from '../app.endpoints';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AdminPermissionService {

  constructor(private http: HttpClient) { }

  public getActiveMembersOfCompanyService(companyId: string): Observable<any> {
      let url = `${endpoints.companyEndpoint()}/${companyId}/members?accountstatus=active`;
      return this.http.get(url);
  }
  public getPendingMembersOfCompanyService(companyId: string): Observable<any> {
      let url = `${endpoints.companyEndpoint()}/${companyId}/members?accountstatus=pending`;
      return this.http.get(url);
  }
   public getActiveMembersOfBucketService(companyId: string,bucketId: string): Observable<any> {
      let url = `${endpoints.companyEndpoint()}/${companyId}/buckets/${bucketId}/members?accountstatus=active`;
      return this.http.get(url);
  }
   public getPendingMembersOfBucketService(companyId: string,bucketId: string): Observable<any> {
      let url = `${endpoints.companyEndpoint()}/${companyId}/buckets/${bucketId}/members?accountstatus=pending`;
      return this.http.get(url);
  }
  
  public addNewMemberAdminToCompanyService(companyId: string, mappingId: string): Observable<any> {    
      let url = `${endpoints.companyEndpoint()}/${companyId}/members`;
        let body = {
            "mappingId": mappingId
        }
      return this.http.post(url, body);
  }
  public addExistingMemberAdminToCompanyService(companyId: string, id: string): Observable<any> {    
      let url = `${endpoints.companyEndpoint()}/${companyId}/activemembers`;
        let body = {
            "uniqueUserId": id
        }
      return this.http.post(url, body);
  }
  public addNewMemberAdminToBucketService(companyId: string, bucketId:string, mappingId: string): Observable<any> {    
      let url = `${endpoints.companyEndpoint()}/${companyId}/buckets/${bucketId}/members`;
        let body = {
            "mappingId": mappingId
        }
      return this.http.post(url, body);
  }
  public addExistingMemberAdminToBucketService(companyId: string, bucketId:string, id: string): Observable<any> {    
      let url = `${endpoints.companyEndpoint()}/${companyId}/buckets/${bucketId}/activemembers`;
        let body = {
            "uniqueUserId": id
        }
      return this.http.post(url, body);
  }
  public deletePendingMemberOfCompanyService(companyId: string, mappingId: string): Observable<any> {
      let url = `${endpoints.companyEndpoint()}/${companyId}/members`;
        let body = {
                "mappingId" : mappingId
            }
      return this.http.put(url, body);
  }
  public deleteExistingMemberOfCompanyService(companyId: string, uniqueUserId: string): Observable<any> {
      let url = `${endpoints.companyEndpoint()}/${companyId}/activemembers`;
        let body = {
                "uniqueUserId" : uniqueUserId
            }
      return this.http.put(url, body);
  }
   public deletePendingMemberOfBucketService(companyId: string,bucketId:string, mappingId: string): Observable<any> {
      let url =  `${endpoints.companyEndpoint()}/${companyId}/buckets/${bucketId}/members`;
        let body = {
                "mappingId" : mappingId
            }
      return this.http.put(url, body);
  }
  public deleteExistingMemberOfBucketService(companyId: string, bucketId:string, uniqueUserId: string): Observable<any> {
      let url = `${endpoints.companyEndpoint()}/${companyId}/buckets/${bucketId}/activemembers`;
        let body = {
                "uniqueUserId" : uniqueUserId
            }
      return this.http.put(url, body);
  }
  
}
