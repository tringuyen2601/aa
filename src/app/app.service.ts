import { Injectable } from '@angular/core';
import { AppConfig } from './app.config';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import endpoints from './app.endpoints';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()

export class ApiService {
    private apiBase = new AppConfig().apiBase;
    private headers = new HttpHeaders({ 'Content-Type': 'application/json;' });
    private options = { headers: this.headers };
	//The Headers statement was causing the app to not load in IE therefore its removed
    public  userDetails=localStorage.getItem("user");
    public  gettoken:any;
    public  getidtoken:any;

    constructor(private http: HttpClient, public notification: ToastrService) {
        if(localStorage.getItem("accessToken")){
            this.gettoken = localStorage.getItem("accessToken");
        }
        if(localStorage.getItem("idToken")){
            this.getidtoken = localStorage.getItem("idToken");
        }
    }

    //using promise for all GET operations
    // get(module: string, parameter?: URLSearchParams): Promise<any> {
    //     this.headers.append("CLIENT-TYPE","mobile");
    //     this.headers.append("X-AUTH-TOKEN",JSON.parse(this.gettoken).accessToken);
    //     this.options = new RequestOptions({ headers: this.headers });
    //     return this.http
    //         .get(this.apiBase + module, { search: parameter, headers: this.headers })
    //         .toPromise()
    //         .then((res)=>{return this.handleSuccess(res)})
    //         .catch((err) => {return this.handleError(err)});
    // }

    //using observables
    // getService(urlAPI: string): Observable<any> {
    //    this.headers.delete("X-AUTH-TOKEN");
    //    this.headers.delete("REDIRECT-URI");
    //    if(this.userDetails!="undefined"){
    //         this.gettoken=JSON.parse(this.userDetails).accessToken;
    //    }
    //     //this.headers.append("CLIENT-TYPE","mobile");
    //     this.headers.append("X-AUTH-TOKEN",this.gettoken);
    //     this.headers.append("REDIRECT-URI","https://"+window.location.host+"/auth");
    //     return this.http
    //         .get(this.apiBase+urlAPI, this.options)
    //         .map(this.extractData)
    //         .catch(this.handleErrorObservable);
    // }
    //  getServiceAgain(urlAPI: string): Observable<any> {
    //    if(this.userDetails!="undefined"){
    //         this.gettoken=JSON.parse(this.userDetails).accessToken;
    //    }
    //     //this.headers.append("CLIENT-TYPE","mobile");
    //     //this.headers.append("X-AUTH-TOKEN",this.gettoken);
    //     //this.headers.append("REDIRECT-URI","https://"+window.location.host+"/auth");
        
    //     return this.http
    //         .get(this.apiBase+urlAPI, this.options)
    //         .map(this.extractData)
    //         .catch(this.handleErrorObservable);
    // }
    getUserService(urlAPI: string): Observable<any> {
        this.headers.delete("X-AUTH-TOKEN");
        this.headers.delete("X-AUTH-ID-TOKEN");
        this.userDetails=localStorage.getItem("user");
        if(this.userDetails!="undefined"){
                this.gettoken=JSON.parse(this.userDetails).accessToken;
                this.getidtoken=JSON.parse(this.userDetails).idToken;
        }
        this.headers.append("X-AUTH-TOKEN",this.gettoken);
        this.headers.append("X-AUTH-ID-TOKEN",this.getidtoken);
        return this.http
            .get(urlAPI, this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }
    getRatingService(urlAPI: string): Observable<any> {
       this.headers.delete("X-AUTH-TOKEN");
       this.headers.delete("REDIRECT-URI");
       if(this.userDetails!="undefined"){
            this.gettoken=JSON.parse(this.userDetails).accessToken;
       }
        //this.headers.append("CLIENT-TYPE","mobile");
        this.headers.append("X-AUTH-TOKEN",this.gettoken);
        //this.headers.append("REDIRECT-URI","https://manufacturer-web.apps.de1.bosch-iot-cloud.com/auth");
        
        //this.headers.append("REDIRECT-URI","https://rating-q.apps.de1.bosch-iot-cloud.com"+"/ratings");
        return this.http
            .get(urlAPI, this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }
    // getMockRatingService(urlAPI: string): Observable<any> {
    //     this.headers.delete("X-AUTH-TOKEN");
    //     //this.headers.append("REDIRECT-URI","https://rating-q.apps.de1.bosch-iot-cloud.com"+"/ratings");
    //     return this.http
    //         .get(urlAPI, this.options)
    //         .map(this.extractData)
    //         .catch(this.handleErrorObservable);
    // }
    getUserRatingsService(urlAPI: string): Observable<any>{
       this.headers.delete("X-AUTH-TOKEN");
       this.headers.delete("REDIRECT-URI");
       if(this.userDetails!="undefined"){
            this.gettoken=JSON.parse(this.userDetails).accessToken;
       }
        //this.headers.append("CLIENT-TYPE","mobile");
        this.headers.append("X-AUTH-TOKEN",this.gettoken);
         return this.http
            .get(urlAPI, this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }
    getTaxonomyService(urlAPI: string): Observable<any>{
         this.headers.delete("X-AUTH-TOKEN");
         return this.http
            .get(urlAPI, this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }
     postReviewCommentsService(urlAPI: string, param: any): Observable<any> {
        //let body = JSON.stringify(param);
        //this.headers.append("X-AUTH-TOKEN",this.gettoken);
        //this.headers.append("REDIRECT-URI","https://"+window.location.host+"/auth");
        this.headers.append("X-AUTH-TOKEN",this.gettoken);
        return this.http
            .post(urlAPI, param, this.options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }
    // postKeycloakService(urlAPI: string, param: any): Observable<any> {
    //      this.headers.append("Authorization","Basic dGhpbmdib29rLWtleWNsb2FrOmZmM2Y1NTZmLTk0ZmQtNDVmYS05NzhlLTA1ZTUyZGQ1ZGFjNA==");
    //      this.headers.append("Content-Type","application/x-www-form-urlencoded");
    //      this.headers.append("Authorization", "Basic Auth" + btoa("thingbook-keycloak" + ":" + "ff3f556f-94fd-45fa-978e-05e52dd5dac4")); 
    //       return this.http
    //         .post(urlAPI, param, this.options)
    //         .map(this.extractData)
    //         .catch(this.handleErrorObservable);
    // }   
    createService(urlAPI: string, param: any): Observable<any> {
        let body = JSON.stringify(param);
        //this.headers.append("X-AUTH-TOKEN",this.gettoken);
        //this.headers.append("REDIRECT-URI","https://"+window.location.host+"/auth");
        return this.http
            .post(this.apiBase+urlAPI, body, this.options)
            .map(this.extractDataForNoJson)
            .catch(this.handleErrorObservable);
    }
    
     updateService(urlAPI: string, param: any): Observable<any> {
        let body = JSON.stringify(param);
        //this.headers.append("X-AUTH-TOKEN",this.gettoken);
        //this.headers.append("REDIRECT-URI","https://"+window.location.host+"/auth");
        return this.http
            .put(this.apiBase+urlAPI, body, this.options)
            .map(this.extractDataForNoJson)
            .catch(this.handleErrorObservable);
    }
    deleteService(APIWithname: any): Observable<any> {
       // let params: URLSearchParams = new URLSearchParams();
       // console.log("params",params);
        // for (var key in param) {
        //     if (param.hasOwnProperty(key)) {
        //         let val = param[key];
        //         params.set(key, val);
        //     }
        // }
        //this.headers.append("X-AUTH-TOKEN",this.gettoken);
        //this.headers.append("REDIRECT-URI","https://"+window.location.host+"/auth");
       // this.options = new RequestOptions({ headers: this.headers, search: params });
        return this.http
            .delete(this.apiBase+APIWithname, this.options)
            .map(this.extractDataForNoJson)
            .catch(this.handleErrorObservable);
    }

    deleteServiceWithId(url: string, key: string, val: string): Observable<any> {
        return this.http
            .delete(url + "/?" + key + "=" + val, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    //authentication service
    public getTokenFromCodeForKeycloak(code: string): Observable<any> {
        
        // Add x-auth code and other params to header
        const headers = new HttpHeaders({
            'X-AUTH-CODE': code,
            'REDIRECT-URI': `${endpoints.redirectUriEndpoint()}`,
            'IDM_PROVIDER': 'KEYCLOAK',
        });

        // Add headers to request
        const options = {
            headers: headers
        };
        
        let url = `${endpoints.authenticationEndpoint()}/token`;

        return this.http.get(url, options);
    }

    //for successfull API response
    private handleSuccess(response: any): Promise<any> {
        if (response.status === 200) {

            //convert the response body as JSON
            let res = response.json();

            if (res.code === 200) {
                console.log(res);


               this.notification.success(res.message);
                return Promise.resolve(res.data);
            }
            else {
               this.notification.error(res.message);
                return Promise.reject(res);
            }
        }

    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
     private extractDataForNoJson(res: Response) {
        let body = res["_body"];
        return body;
    }
    //for error handling
    public handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error);
    }
    private handleErrorObservable(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
    
}