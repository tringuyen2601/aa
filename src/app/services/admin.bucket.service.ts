import { Injectable } from '@angular/core';
import endpoints from '../app.endpoints';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AdminBucketService {

  constructor(private http: HttpClient) { }

  //bucket api
  public getBucketsOfCompanyService(companyId: string): Observable<any> {
      let url = `${endpoints.companyEndpoint()}/${companyId}/buckets`;
      return this.http.get(url);
  }

  public addBucketToCompanyService(companyId: string, name: string): Observable<any> {    
      let url = `${endpoints.companyEndpoint()}/${companyId}/buckets`;
      let body = {
          "name": name
      }
      return this.http.post(url, body);
  }

  public deleteBucketOfCompanyService(companyId: string, bucketId: string): Observable<any> {
      let url = `${endpoints.companyEndpoint()}/${companyId}/buckets/${bucketId}`;
      return this.http.delete(url);
  }

  public editBucketOfCompanyService(companyId: string, bucketId: string, name: string): Observable<any> {
      let url = `${endpoints.companyEndpoint()}/${companyId}/buckets/${bucketId}`;
      let body = {
              "name" : name
          }
      return this.http.put(url, body);
  }

}
