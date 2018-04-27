import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { ApiService } from '../app.service';

import 'rxjs/add/operator/toPromise';
@Injectable()
export class HeaderService {

  constructor(private apiService: ApiService) { }
  private getUserAPI(){
    		let hostName = window.location.host;
    		if(hostName.indexOf('-d') > -1)
        {
          return 'https://user-d.apps.de1.bosch-iot-cloud.com/';	
        }
    		else if(hostName.indexOf('-q') > -1)
        {
            return 'https://user-q.apps.de1.bosch-iot-cloud.com/';	
        }
    		else{
           return 'http://localhost:9101/';
        }
    	};
  protected apiEndPoint: string = this.getUserAPI();//https://rating-q.apps.de1.bosch-iot-cloud.com
                                                                                  //9101/
                                                                                  //https://user-q.apps.de1.bosch-iot-cloud.com/
    getUserInfo() {
       return this.apiService.getUserService(this.apiEndPoint+"users/?refresh=true");
    }
    
}
