import { Injectable } from '@angular/core';
import {
  Http, ConnectionBackend, RequestOptions, Request, Response, RequestOptionsArgs, RequestMethod, ResponseOptions, URLSearchParams, Headers
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { _throw } from 'rxjs/observable/throw';
import { catchError } from 'rxjs/operators';
import { extend } from 'lodash';

/**
 * Provides a base framework for http service extension.
 * The default extension adds support for API prefixing, request caching and default error handler.
 */
@Injectable()
export class HttpService extends Http {

  constructor(backend: ConnectionBackend,
    private defaultOptions: RequestOptions) {
    // Customize default options here if needed
    super(backend, defaultOptions);
  }

  /**
   * Performs any type of http request.
   * You can customize this method with your own extended behavior.
   */
  request(request: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    const requestOptions = options || {};
    //Modify option here if needed
    // Add params: locale and language for all GET requests
    let accessToken = localStorage.getItem("accessToken");
    console.log('Before request accessToken: ', accessToken);
    console.log('requestOptions Before: ', requestOptions);
    if(accessToken){
      if(requestOptions.headers){
        requestOptions.headers.set('X-AUTH-TOKEN', accessToken);
        //.append('X-AUTH-TOKEN', accessToken);
        //&& !requestOptions.headers.has('X-AUTH-TOKEN')
      } else {
        requestOptions.headers = new Headers({'X-AUTH-TOKEN': accessToken});
      }
    }
    console.log('requestOptions After: ', requestOptions);
    return this.httpRequest(request, requestOptions)
    .map(this.extractData);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {

    // Add params: locale and language for all GET requests
    // let params = new URLSearchParams();
    // params.append("locale", localStorage.getItem("accessToken"));

    const requestOptions = options || {};

    // if (requestOptions.params) {
    //   (<URLSearchParams>requestOptions.params).appendAll(params);
    // }
    // else {
    //   requestOptions.params = params;
    // }


    return this.request(url, extend({}, requestOptions, { method: RequestMethod.Get }));
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {

    return this.request(url, extend({}, options, {
        body: body,
        method: RequestMethod.Post
      }));
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(url, extend({}, options, {
      body: body,
      method: RequestMethod.Put
    }));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(url, extend({}, options, { method: RequestMethod.Delete }));
  }

  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(url, extend({}, options, {
      body: body,
      method: RequestMethod.Patch
    }));
  }

  head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(url, extend({}, options, { method: RequestMethod.Head }));
  }

  options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.request(url, extend({}, options, { method: RequestMethod.Options }));
  }

  // Customize the default behavior for all http requests here if needed
  private httpRequest(request: string | Request, options: RequestOptionsArgs): Observable<Response> {
    let req = super.request(request, options);
    //options.skipErrorHandler
    //req = req.pipe(catchError((error: any) => this.errorHandler(error)));
    //req = req.catch(this.errorHandler);
    return new Observable<Response>(sub =>{
      req.subscribe(res =>{
        sub.next(res);
      }, err =>{
        this.errorHandler(err);
        sub.error(err);
      }, () => {
        sub.complete();
      })
    });
  }

  // Customize the default error handler here if needed
  private errorHandler(response: Response): Observable<Response> {
    throw response;
  }

  private extractData(res: Response) {
        let body = res.json();
        return body || {};
  }

}
