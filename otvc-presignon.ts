import { Component } from '@angular/core';
import { BasePage } from '../../base/base';
import { IonicPage, NavController, MenuController, NavParams, ModalController, LoadingController, Platform } from 'ionic-angular';
import { AppErrorHandler } from '../../services/errorhandler/AppErrorHandler';
import { ErrorEventHandlerService } from '../../../services/errorEventHandlerService/ErrorEventHandlerService';
import { StateTransitionService } from '../../../services/stateTransition/state.transition.service';
import { PageInitService } from '../../../services/pageInitService/pageInitService';
import { RootService } from '../../../services/rootService/root.service';
import { isUndefined, isDefined } from 'ionic-angular/util/util';
import { SessionStorageService } from '../../../services/StorageService/SessionStorageService';
import { LoadingService } from '../../../services/loadingService/loading.service';
import { OtvcValidatorService } from '../validation/otvcValidatorService';
import { OTVCRestApiService } from '../../../providers/otvcservice/otvcRESTApiService';
import { PopupService } from '../../../services/popupService/popupService';

declare var require: any;
declare var window: any;

@IonicPage({ name: 'OtvcPresignon', segment: 'signon/:lang/:lob' })
@Component({
    selector: 'page-otvc-presignon',
    templateUrl: 'otvc-presignon.html',
    providers: [AppErrorHandler]
})

export class OtvcPresignon extends BasePage {
    pageContent: any;
    isDataAvailable: boolean = false;
    headerObj: any;
    footerObj: any;
    lob: boolean;
    lang: string;
    isWrapper: boolean;
    hasUnexpectedException: boolean = false;
    unexpectedException: string;
    error: string = 'error';
    formError: any = {};
    modetype: string = "";
    skip: any;
    pageState: any;
    header: string;
    tooltipModal: any;
    isSubmit: boolean;

    config = require('../../../providers/commonpostsignongatewayservice/gateway-config.json');
    stateConfig = require('../../../services/stateTransition/state.config.json');

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public location: Location,
        public errorHandler: AppErrorHandler,
        public errorEventHandler: ErrorEventHandlerService,
        public stateTransitionService: StateTransitionService,
        public pageInitService: PageInitService,
        public rootService: RootService,
        public loadingService: LoadingService,
        public popupService: PopupService,
        public otvcValidator: OtvcValidatorService,
        private cibcStorage: CibcStorage,
        private modalCtrl: ModalController,
        private otvcRestApiService: OTVCRestApiService
    ) {
        super(navCtrl, location, errorEventHandler, errorHandler, stateTransitionService, pageInitService);

        let root: any = RootService.getRoot();
        // this.content = require('./signon.json');
        // this.pageContent = this.content.PageContentResp.Contents;


        if (isUndefined(root)) {
            this.lang = (this.navParams.get('lang') ? this.navParams.get('lang') : (this.cookieService.get('MBI_LANG') ? this.cookieService.get('MBI_LANG') : 'en'));
            this.lob = (this.navParams.get('lob') ? this.navParams.get('lob') : (this.cookieService.get('MBI_LOB') ? this.cookieService.get('MBI_LOB') : 'ie'));
            let root = { 'lob': this.lob, 'lang': this.lang };
            RootService.setRoot(root);
        } else {
            this.lob = root.lob;
            this.lang = root.lang;
        }

        this.headerObj = {
            "mode": 'SignOn', "showlogo": true, "hideBackButton": true,
            'lob': this.lob, 'lang': this.lang
        };

        this.footerObj = { "type": 'SignOn', 'lob': this.lob, 'lang': this.lang };
    }

    setPageState(data) {
        this.pageContent = data.PageContentResp.Contents;
        this.isDataAvailable = true;
        this.headerObj.headerContent = this.pageContent.text.header;
        this.isWrapper = RootService.getWrapperObj("isWrapperApp");

        this.footerObj.content = this.pageContent;

        this.hasUnexpectedException = this.navParams.get('unexpectedException');
        if (this.hasUnexpectedException) {
            this.unexpectedException = this.pageContent.error.unexpectedException;
        }

        this.setInitData();
    }

    setInitData() {
        let otvcsetupCache = SessionStorageService.getData('otvcsetupCache');
        var cachedData = otvcsetupCache.get('initData');
        this.modetype = 'preTxn';
        if (isUndefined(cachedData)) {
            this.skip = cachedData.RetrieveOtvcResp.Skip;
            this.otvcPageState(cachedData.RetrieveOtvcResp, cachedData.PageContentResp.Contents);
            if (isUndefined(otvcsetupCache.get('confirmData'))) {
                this.confirmChange();
            }
        } else {
            this.gatewayInit(this.modetype).then(
                function (result: any) {
                    this.cibcLoading.hide();
                    this.otvcPageState(result.data.RetrieveOtvcResp, result.data.PageContentResp.Contents);
                },

                function (failureResult) {
                    // @ifdef DEBUG
                    console.log('Error callback of touch id settings init. failureResult=');
                    console.log(JSON.stringify(failureResult));
                    // @endif

                    var errorProcessor = this.restErrorProcessor.getCrossFlowTransitionErrProcessor(failureResult);

                    errorProcessor
                        .process()
                        .resolve();

                    this.loadingService.dismiss();
                });
            this.loadingService.present();
        };
    }

    otvcPageState(otvcDetails, pageContent) {
        this.pageContent = pageContent;
        //this.formValidationMessages = this.setUpFormValidationMessages(pageContent);
        this.pageState = this.otvcValidator.populateErrorModel(this.pageState);
        this.header = this.isUserLogIn() ? pageContent.text.pageHeader1 : pageContent.text.pageHeader2;
        if (isUndefined(otvcDetails.OtvcDetail)) {
            this.pageState.alwaysOtvc = otvcDetails.OtvcDetail.AlwaysOtvc;
            var contacts = otvcDetails.OtvcDetail.Contact;
            contacts.forEach(obj => {
                if (obj.Method != 'MOBILE_PHONE_TEXT') {
                    this.pageState[obj.Method].value = obj.Method != 'EMAIL' ? this.toViewFormat(obj.Value) : obj.Value;
                }
            })
        }
        this.tooltipModal = this.modalCtrl.create(pageContent, this.header);
        this.validateSubmit();
    }

    confirmChange() {
        this.loadingService.dismiss();
        let alertContent = {
            title: "",
            subTitletitle: "",
            message: this.pageContent.text.completed,
            buttons: this.pageContent.text.okButton,
            onPresent: () => {
                var otvcsetupCache = this.cibcCache.getCache('otvcsetupCache');
                otvcsetupCache.remove('confirmData');
            }
        };
        this.popupService.presentAlert(alertContent);
    }
    toViewFormat(modelPhone) {
        modelPhone = modelPhone.replace(/[^0-9]/g, '');
        this.validateSubmit();
        if (modelPhone) {
          // $scope.isSubmit = isDefined($scope.pageState.EMAIL.value)?validateEmail($scope.pageState.EMAIL.value):true;  
          //e.g. 416
          if (modelPhone.length <= 3) {
            return modelPhone;
          }
          //e.g. 416581
          if (modelPhone.length <= 6) {
            var area = modelPhone.substr(0, 3);
            var num1 = modelPhone.substr(3);
            return  `${area} ${num1}`;            
          }
          //e.g. 14165817080
          var area = modelPhone.substr(0, 3);
          var num1 = modelPhone.substr(3, 3);
          var num2 = modelPhone.substr(6);
    return `(${area} ${num1} ${num2})`;
        }
        //return null;
      }

    validateSubmit() {
        var validPhone = (isDefined(this.pageState.HOME_PHONE.value) || isDefined(this.pageState.MOBILE_PHONE.value) || isDefined(this.pageState.BUSINESS_PHONE.value));
        if (isDefined(this.pageState.EMAIL.value) && this.pageState.EMAIL.value != "") {
            this.isSubmit = this.validateEmail(this.pageState.EMAIL.value) && validPhone;
        } else {
            this.isSubmit = validPhone;
        }
    }
    validateEmail(email) {
        let passWhitelist = false;
        let INVERSE_WHITELIST = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (isDefined(email) && email != "") {
            passWhitelist = !(email.match(INVERSE_WHITELIST) === null);
            this.isSubmit = passWhitelist;
            return passWhitelist;
        } else {
            this.isSubmit = (isDefined(this.pageState.HOME_PHONE.value) || isDefined(this.pageState.MOBILE_PHONE.value) || isDefined(this.pageState.BUSINESS_PHONE.value));
            return this.isSubmit;
        }

    }

    isUserLogIn() {
        var restoredValue = this.cibcStorage.getObject(
            this.cibcStorage.sessionStorage,
            this.cibcStorage.cookieStorage,
            'userSignedOn');
        var userSignedOn = restoredValue.value;
        if (!isDefined(userSignedOn)) {
            userSignedOn = false;
        }
        return userSignedOn;
    }

    gatewayInit(mode) {
        // CibcStorage.setObject(
        //     CibcStorage.sessionStorage,
        //     CibcStorage.cookieStorage,
        //     'userSignedOn', true);
        return new Promise((resolve, reject) => {
            let req = {
                "PageContentReq": { "PageName": "Security" },
                "RetrieveOtvcReq": {}
            }
            this.transactionInit(req).subscribe(function (result) {
                var otvcsetupCache = SessionStorageService.getData('otvcsetupCache');
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
                resolve(result);
            }, function (result) {
                reject(result);
            });
        });
    }

    transactionInit(payload) {
        let endpoint = this.config.appRestBaseUrl + this.config.cibcOtvcSetupConfig.serviceRootURL +
            this.config.cibcOtvcSetupConfig.serviceURLs.initURL;

        return this.otvcRestApiService.init(endpoint, payload);
    }
    transactionValidate(obj) {
        var endpoint = this.config.appRestBaseUrl + this.config.cibcOtvcSetupConfig.serviceRootURL +
          this.config.cibcOtvcSetupConfig.serviceURLs.validateURL;
    
        var payload = {
          ValidateOtvcDetailReq: obj,
          PageContentReq: { "PageName": "IdentityVerification" }
        };
    
        return this.otvcServiceAPI.validate(endpoint, payload);
      }
    
      transactionSetUserLogIn() {
        if (!this.isUserLogIn()) {
          this.cibcStorage.setObject(
            this.cibcStorage.sessionStorage,
            this.cibcStorage.cookieStorage,
            'userSignedOn', true);
        }
      }
    
      transactionSkip() {
        var endpoint = this.config.appRestBaseUrl + this.config.cibcOtvcSetupConfig.serviceRootURL +
          this.config.cibcOtvcSetupConfig.serviceURLs.serviceOTVCSkipURL;
        var payload = {};
        return this.otvcServiceAPI.skip(endpoint, payload);
      }
    
      /*Gateway service methods*/
      gatewayInit(mode) {
        // CibcStorage.setObject(
        //     CibcStorage.sessionStorage,
        //     CibcStorage.cookieStorage,
        //     'userSignedOn', true);
        return new Promise((resolve, reject) => {
          let req = {
            "PageContentReq": { "PageName": "Security" },
            "RetrieveOtvcReq": {}
          }
          this.transactionInit(req).then(function (result) {
            var otvcsetupCache = SessionStorageService.getData('otvcsetupCache');
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
            resolve(result);
          }, function (result) {
            reject(result);
          });
        });
      }
    
      gatewayValidate(req) {
        return new Promise((resolve, reject) => {
          this.transactionValidate(req).then(
            function (result) {
              //success callback
              var otvcsetupCache = SessionStorageService.getData('otvcsetupCache');
              otvcsetupCache.put('otvcData', result.data);
              this.transactionSetUserLogIn();
              resolve(result);
            },
            function (result) {
              //error callback
              var otvcCache = SessionStorageService.getData('otvcsetupCache');
              // _canProceed=true;
              otvcCache.put('errorData', result.data);
              // _nextState = 'preTxn.signOn';
              reject(result);
            }
          );
        });
      }
    
      gatewaySkip(code) {
        return new Promise((resolve, reject) => {
          this.transactionSkip().then(
            function (result) {
              //success callback
              var otvcCache = SessionStorageService.getData('otvcsetupCache');
              otvcCache.put('verifyOTVCData', result.data);
              this.canProceed = true;
              this.nextState = 'MyAccounts';
              resolve(result);
            },
            function (result) {
              //error callback
              var otvcCache = SessionStorageService.getData('otvcsetupCache');
              // _canProceed=true;
              otvcCache.put('errorData', result.data);
              // _nextState = 'preTxn.signOn';
              reject(result);
            }
          );
        });
      }
    }

