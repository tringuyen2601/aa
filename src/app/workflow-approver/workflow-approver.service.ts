import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { ApiService } from '../app.service';

import 'rxjs/add/operator/toPromise';
@Injectable()
export class WorkflowApproverService {

  constructor(private apiService: ApiService) { }
   private getRatingAPI(){
    		let hostName = window.location.host;
    		if(hostName.indexOf('-d') > -1)
            {
                return 'https://rating-d.apps.de1.bosch-iot-cloud.com';	
            }
            else if(hostName.indexOf('-q') > -1)
            {
                return 'https://rating-q.apps.de1.bosch-iot-cloud.com';	
            }
            else{
                return 'http://localhost:9109';
            }
    	};
    private getTaxonomyAPI(){
    		let hostName = window.location.host;
    		if(hostName.indexOf('-d') > -1)
            {
                return 'https://product-taxonomy-d.apps.de1.bosch-iot-cloud.com';	
            }
            else if(hostName.indexOf('-q') > -1)
            {
                return 'https://product-taxonomy-q.apps.de1.bosch-iot-cloud.com';	
            }
            else{
                return 'http://localhost:9111';
            }
    	};
  //protected apiEndPoint: string = "http://localhost:9109";//https://rating-q.apps.de1.bosch-iot-cloud.com
  //protected apiEndPointForTaxonomy: string = "http://localhost:9111";//https://rating-q.apps.de1.bosch-iot-cloud.com
  protected apiEndPoint: string = this.getRatingAPI();//https://rating-q.apps.de1.bosch-iot-cloud.com
  protected apiEndPointForTaxonomy: string = this.getTaxonomyAPI();//https://product-taxonomy-q.apps.de1.bosch-iot-cloud.com
    getUserComments() {
      //https://rating-q.apps.de1.bosch-iot-cloud.com/ratings/users/comments?lang=en
        return this.apiService.getRatingService(this.apiEndPoint+"/ratings/users/comments?pageindex=0&pagesize=100");
    }
    getUserRatings(item_id){
        return this.apiService.getUserRatingsService(this.apiEndPoint+"/ratings/items/"+item_id+"/users");
    }
    getCategoryNode(id){
        return this.apiService.getTaxonomyService(this.apiEndPointForTaxonomy+"/taxonomy/"+id+"/parents/children?lang=EN");
    }
    sendReviewComments(param:any){
        return this.apiService.postReviewCommentsService(this.apiEndPoint+"/ratings/users/comments",param);
    }
    // getMockAPI(){
    //      return this.apiService.getMockRatingService("http://10.164.145.234:8080/ratingAPISample.json");
    // }
}
