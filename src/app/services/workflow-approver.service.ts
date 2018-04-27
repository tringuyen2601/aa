import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import endpoints from '../app.endpoints';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WorkflowApproverService {

  constructor(private http: Http) { }
  public getUserComments(): Observable<any> {
       let url = `${endpoints.workflowApproverRatingEndpoint()}/users/comments?pageindex=0&pagesize=100`;
      return this.http.get(url);
    }
    public getUserRatings(item_id: any): Observable<any> {
        let url = `${endpoints.workflowApproverRatingEndpoint()}/items/${item_id}/users`;
      return this.http.get(url);
    }
    public getCategoryNode(id: any): Observable<any> {
        let url = `${endpoints.workflowApproverProductTaxonomyEndpoint()}/${id}/parents/children?lang=EN`;
      return this.http.get(url);
    }
    public sendReviewComments(param: any): Observable<any> {    
      let url = `${endpoints.workflowApproverRatingEndpoint()}/users/comments`;
      let body = JSON.stringify(param);
      return this.http.post(url, body);
  }
}
