import { Injectable } from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';
import { OTVCServiceAPI } from '../../providers/otvcservice/otvcRESTApiService';
@Injectable()
export class OTVCService {
  loading: Loading;
  cibc_otvc_setup_CONFIG.serviceRootURL = '';
  App_restBaseURL;
  cibc_otvc_setup_CONFIG.serviceURLs.initURL = '';
  OTVCService = ['APP_restBaseURL', 'cibc_otvc_setup_CONFIG', 'OTVCServiceAPI', 'cibc_signon_CONFIG', 'CibcStorage'];
  constructor(public otvcServiceApi:OTVCServiceAPI ) {
    
  }
  init(obj) {
    var endpoint = this.App_restBaseURL + this.cibc_otvc_setup_CONFIG.serviceRootURL +
        this.cibc_otvc_setup_CONFIG.serviceURLs.initURL;

    // var pageContentReq = obj;			
    var payload = {};
    payload = obj;

    var promise = this.otvcServiceApi.init(endpoint, payload);
    return promise;
}

validate(obj) {
    var endpoint = this.App_restBaseURL + this.cibc_otvc_setup_CONFIG.serviceRootURL +
        this.cibc_otvc_setup_CONFIG.serviceURLs.validateURL;

    let payload = {};
    payload.ValidateOtvcDetailReq = obj;
    payload.PageContentReq = { "PageName": "IdentityVerification" };

    var promise = this.otvcServiceApi.validate(endpoint, payload);
    return promise;
}

OTVCInit() {
    var endpoint = this.App_restBaseURL + this.cibc_signon_CONFIG.serviceRootURL + this.cibc_signon_CONFIG.serviceOTVCInitURL;

    var initRequest = {};
    var PageContentReq = { "PageName": "IdentityVerification" };

    var payload = {};
    payload.RetrieveOtvcReq = initRequest;
    payload.PageContentReq = PageContentReq;
    var promise = OTVCServiceAPI.OTVCInit(endpoint, payload);
    return promise;
}
OTVCSend(medium) {
    var serviceUrl = (!isUserLogIn()) ? cibc_signon_CONFIG.serviceRootURL : cibc_otvc_setup_CONFIG.serviceRootURL
    var endpoint = APP_restBaseURL + serviceUrl + cibc_signon_CONFIG.serviceOTVCSendURL;

    var payload = {};
    payload.ContactMethod = medium;
    var promise = OTVCServiceAPI.OTVCSend(endpoint, payload);
    return promise;
}
OTVCVerify(code) {
    var serviceUrl = (!isUserLogIn()) ? cibc_signon_CONFIG.serviceRootURL : cibc_otvc_setup_CONFIG.serviceRootURL;

    var endpoint = APP_restBaseURL + serviceUrl + cibc_signon_CONFIG.serviceOTVCVerifyURL;

    var initRequest = {};

    var payload = {};
    payload.Code = code;
    var promise = OTVCServiceAPI.OTVCVerify(endpoint, payload);
    return promise;
}

skip() {
    var endpoint = APP_restBaseURL + cibc_otvc_setup_CONFIG.serviceRootURL +
        cibc_otvc_setup_CONFIG.serviceURLs.serviceOTVCSkipURL;
    var payload = {};
    var promise = OTVCServiceAPI.skip(endpoint, payload);
    return promise;
}
 isUserLogIn() {
    var restoredValue = CibcStorage.getObject(
        CibcStorage.sessionStorage,
        CibcStorage.cookieStorage,
        'userSignedOn');
    var userSignedOn = restoredValue.value;
    if (angular.isUndefined(userSignedOn)) {
        userSignedOn = false;
    }
    return userSignedOn;
}
setUserLogIn() {
    if (!isUserLogIn()) {
        CibcStorage.setObject(
            CibcStorage.sessionStorage,
            CibcStorage.cookieStorage,
            'userSignedOn', true);
    }
}





(function () {
	'use strict';
	var app = angular.module('cibc.otvc');
	app.factory('OTVCService', OTVCService);

	
	function OTVCService(APP_restBaseURL, cibc_otvc_setup_CONFIG, OTVCServiceAPI, cibc_signon_CONFIG, CibcStorage) {

		//exposed API
		return {
			init: init,
			validate: validate,
			skip: skip,
			OTVCInit: OTVCInit,
			OTVCSend: OTVCSend,
			OTVCVerify: OTVCVerify,
			isUserLogIn: isUserLogIn,
			setUserLogIn: setUserLogIn
		};

		function 
	}
})();