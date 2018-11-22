import { Injectable } from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';
import { OTVCService } from '../otvcservice/otvcTransactionService';
@Injectable()
export class OTVCGatewayService {
  loading: Loading;
  canProceed = false;
  nextState = '';
  constructor(public otvcService: OTVCService ) {
    
  }

  init(mode) {
    // CibcStorage.setObject(
    //     CibcStorage.sessionStorage,
    //     CibcStorage.cookieStorage,
    //     'userSignedOn', true);

    var req = {
        "PageContentReq": { "PageName": "Security" },
        "RetrieveOtvcReq": {}
    }
    var promise = this.otvcService.init(req);
    var deferred = $q.defer();
    promise.then(function (result) {
        var otvcsetupCache = CIBCCache.getCache('otvcsetupCache');
        otvcsetupCache.put('initData', result.data);
        otvcsetupCache.put('mode', mode);
       this.canProceed = true;
        if (mode == 'preTxn') {
            this.nextState = 'preTxn.OTVCSETUP';
        } else {
            if (mode == 'DEFAULT') {
                otvcsetupCache.put('confirmData', true);
            }
            this.nextState = 'txn.OTVCSETUP'
        }
        deferred.resolve(result);
    },
        function (result) {
            deferred.reject(result);
        });

    return deferred.promise;
}

 OTVCInit() {
                var promise = this.otvcService.OTVCInit();
                var pageName = 'IdentityVerification';

                var deferred = $q.defer();
                promise.then(function (result) {

                    var otvcCache = CIBCCache.getCache('otvcsetupCache');
                    if (pageName!= null) {
                        otvcCache.put('pageName', pageName);
                    }
                    otvcCache.put('otvcData', result.data);

                    this.canProceed = true;
                    // _nextState = 'preTxn.PVQ';                    
                    this.nextState = 'preTxn.OTVC';
                    deferred.resolve(result);
                },
                    function (result) {
                        deferred.reject(result);
                    });
                return deferred.promise;
            }

            OTVCVerify(code) {
                var deferred = $q.defer();

                var promise = this.otvcService.OTVCVerify(code);
                promise.then(
                    function (result) {
                        //success callback
                        var otvcCache = CIBCCache.getCache('otvcsetupCache');
                        otvcCache.put('verifyOTVCData', result.data);
                        this.canProceed = true;
                        this.nextState = 'MyAccounts';
                        deferred.resolve(result);
                    },
                    function (result) {
                        //error callback
                        var otvcCache = CIBCCache.getCache('otvcsetupCache');
                        // _canProceed=true;
                        otvcCache.put('errorData', result.data);
                        // _nextState = 'preTxn.signOn';
                        deferred.reject(result);
                    }
                );
                return deferred.promise;
            }
             skip(code) {
                var deferred = $q.defer();

                var promise = this.otvcService.skip();
                promise.then(
                    function (result) {
                        //success callback
                        var otvcCache = CIBCCache.getCache('otvcsetupCache');
                        otvcCache.put('verifyOTVCData', result.data);
                        this.canProceed = true;
                        this.nextState = 'MyAccounts';
                        deferred.resolve(result);
                    },
                    function (result) {
                        //error callback
                        var otvcCache = CIBCCache.getCache('otvcsetupCache');
                        // _canProceed=true;
                        otvcCache.put('errorData', result.data);
                        // _nextState = 'preTxn.signOn';
                        deferred.reject(result);
                    }
                );
                return deferred.promise;
            }

            validate(req) {
                var deferred = $q.defer();

                var promise = this.otvcService.validate(req);
                promise.then(
                    function (result) {
                        //success callback
                        var otvcsetupCache = CIBCCache.getCache('otvcsetupCache');
                        otvcsetupCache.put('otvcData', result.data);
                        this.otvcService.setUserLogIn();
                        deferred.resolve(result);
                    },
                    function (result) {
                        //error callback
                        var otvcCache = CIBCCache.getCache('otvcsetupCache');
                        // _canProceed=true;
                        otvcCache.put('errorData', result.data);
                        // _nextState = 'preTxn.signOn';
                        deferred.reject(result);
                    }
                );
                return deferred.promise;
            }

            proceed() {
                if (this.canProceed) {
                    this.canProceed = false;
                    //$state.transitionTo(nextState);
                    
                }
            }





(
    function () {
    'use strict';
    var app = angular.module('cibc.otvc');
    app.factory('OTVCGatewayService', ['CIBCCache', '$state', '$q', 'OTVCService', 'CibcStorage',
        function (CIBCCache, $state, $q, OTVCService, CibcStorage) {

            
            return {
                init: init,
                OTVCInit: OTVCInit,
                OTVCVerify: OTVCVerify,
                skip: skip,
                validate: validate,
                proceed: proceed
            }
           

            function init(mode) {
                // CibcStorage.setObject(
                //     CibcStorage.sessionStorage,
                //     CibcStorage.cookieStorage,
                //     'userSignedOn', true);

                var req = {
                    "PageContentReq": { "PageName": "Security" },
                    "RetrieveOtvcReq": {}
                }
                var promise = OTVCService.init(req);
                var deferred = $q.defer();
                promise.then(function (result) {
                    var otvcsetupCache = CIBCCache.getCache('otvcsetupCache');
                    otvcsetupCache.put('initData', result.data);
                    otvcsetupCache.put('mode', mode);
                    canProceed = true;
                    if (mode == 'preTxn') {
                        nextState = 'preTxn.OTVCSETUP';
                    } else {
                        if (mode == 'DEFAULT') {
                            otvcsetupCache.put('confirmData', true);
                        }
                        nextState = 'txn.OTVCSETUP'
                    }
                    deferred.resolve(result);
                },
                    function (result) {
                        deferred.reject(result);
                    });

                return deferred.promise;
            }

            function OTVCInit() {
                var promise = OTVCService.OTVCInit();
                var pageName = 'IdentityVerification';

                var deferred = $q.defer();
                promise.then(function (result) {

                    var otvcCache = CIBCCache.getCache('otvcsetupCache');
                    if (angular.isDefined(pageName)) {
                        otvcCache.put('pageName', pageName);
                    }
                    otvcCache.put('otvcData', result.data);

                    canProceed = true;
                    // _nextState = 'preTxn.PVQ';                    
                    nextState = 'preTxn.OTVC';
                    deferred.resolve(result);
                },
                    function (result) {
                        deferred.reject(result);
                    });
                return deferred.promise;
            }

           
        }
    ]);
})();