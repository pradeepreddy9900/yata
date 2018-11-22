import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class OTVCServiceAPI{
    exports: any;

    constructor(public http: HttpClient) { 

       this.exports.init();
        this.exports.validate();
        this.exports.OTVCInit();
        this.exports.OTVCSend();
       this.exports.OTVCVerify();
        this.exports.skip();
    }
   
    validate(endpoint,requestObject){
        return this.http.post(endpoint,requestObject);
      }
  
    init(endpoint,requestObject){
        return this.http.post(endpoint,requestObject);
      }
  
    OTVCInit(endpoint,requestObject){
        return this.http.post(endpoint,requestObject);
      }
    OTVCSend(endpoint,requestObject){
        return this.http.post(endpoint,requestObject);
      }
    OTVCVerify(endpoint,requestObject){
        return this.http.post(endpoint,requestObject);
      }
    skip(endpoint,requestObject){
        return this.http.post(endpoint,requestObject);
      }
    }
     
   