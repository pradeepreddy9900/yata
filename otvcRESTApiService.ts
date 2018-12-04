import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class OTVCRestApiService {
  data: any;
  constructor(public http: HttpClient) { }

  validate(url, requestObject){
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.post(url, requestObject).map(this.success, this);
    }
  }

  init(endpoint, requestObject) {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.post(endpoint, requestObject).map(this.success, this);
    }
  }

  OTVCInit(endpoint, requestObject) {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.post(endpoint, requestObject).map(this.success, this);
    }
  }

  OTVCSend(endpoint, requestObject) {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.post(endpoint, requestObject).map(this.success, this);
    }
  }

  OTVCVerify(endpoint, requestObject) {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.post(endpoint, requestObject).map(this.success, this);
    }
  }

  skip(endpoint, requestObject) {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.post(endpoint, requestObject).map(this.success, this);
    }
  }

  success(data: any) {
    console.log("Help Success.... " + data);
    return data;
  }
}

