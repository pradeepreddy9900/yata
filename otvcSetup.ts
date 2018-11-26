import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
//import { AnonymousSubject } from 'rxjs';
//import { OtvcValidatorService } from '../../otvcValidatorService/otvcValidatorService';
import { AppErrorHandler } from '../../services/errorhandler/AppErrorHandler';
import { BasePage } from '../../base/base';
//import { CachedService } from '../../services/cachedService/cachedService';
import { SessionStorageService } from '../../../services/StorageService/SessionStorageService';
import { RootService } from '../../../services/rootService/root.service';
import { isDefined } from 'ionic-angular/umd/util/util';
import { LoadingService } from '../../../services/loadingService/loading.service';
import { isUndefined } from 'ionic-angular/util/util';
//import { OTVCGatewayService } from '../../../services/otvcservice/otvcGatewayService';
import { Commonpostsignongatewayservice } from './../../providers/commonpostsignongatewayservice/commonpostsignongatewayservice';
import { ReportingErrorHandler } from '../../services/reportingService/ReportingErrorHandler';
import { OTVCService } from '../../services/otvcservice/otvcTransactionService';
import { ErrorEventHandlerService } from '../../services/errorEventHandlerService/ErrorEventHandlerService';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { StateTransitionService } from './../../services/stateTransition/state.transition.service';
import { PageInitService } from '../../services/pageInitService/pageInitService';

@IonicPage({ name:'OtvcSetup', segment:'/otvcSetup' })
@Component({
  selector: 'page-otvcSetup',
  templateUrl: 'otvcSetup.html'
})
export class OtvcSetupPage extends BasePage  {

  public isSubmit: boolean;
  public pageState: any = {};
  public pageContent: any = {};
  public completed: boolean;
  public modetype: string;
  public errorModel: object = {};
  public tooltipModal: any;
  public skip: any;
  public formValidationMessages: any;
  public header: string;
  public isFormSubmit: boolean;
  public lang: string;
  public lob: string;
  public isWrapper: boolean;
  public isIos: boolean;
  headerObj: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public cookieService: CookieService,
    public rootService: RootService,
    public otvcGatewayService: OTVCGatewayService,
    public loadingService: LoadingService,
    public errorHandler: AppErrorHandler,
    public stateTransitionService: StateTransitionService,
    public location: Location,
    public pageInitService: PageInitService,
    public errorEventHandler: ErrorEventHandlerService, 
    public commonGatewayService: Commonpostsignongatewayservice,
    public reportingErrorHandler: ReportingErrorHandler, 
    public otvcService: OTVCService, 
    public otvcValidator: OtvcValidatorService, 
    public modalctrl: ModalController) {

      super(navCtrl, location, errorEventHandler, errorHandler, stateTransitionService, pageInitService);

    let root: any = RootService.getRoot();
    if (isUndefined(root)) {
      this.lang = (this.navParams.get('lang') ? this.navParams.get('lang') : (this.cookieService.get('MBI_LANG') ? this.cookieService.get('MBI_LANG') : 'en'));
      this.lob = (this.navParams.get('lob') ? this.navParams.get('lob') : (this.cookieService.get('MBI_LOB') ? this.cookieService.get('MBI_LOB') : 'ie'));
      let root = { 'lob': this.lob, 'lang': this.lang };
      RootService.setRoot(root);
    } else {
      this.lob = root.lob;
      this.lang = root.lang;
    }
    //RootService.omniturePageName("Sign On-OTVC");
    this.headerObj = {
      "mode": 'SignOn',
      "showlogo": true,
      "hideBackButton": true,
      'lob': this.lob,
      'lang': this.lang
    };
    RootService.setPageName("otvcSetup");

    createRequest() {
      RootService.setPageName("otvcSetup");
      return { "SavedUserIdsReq": {}, "PageContentReq": { "PageName": "Security", "Lob": this.lob, "Locale": this.lang } };
    }
  

    ///     
   /* req = {
      "PageContentReq": { "PageName": "Security" },
      "RetrieveOtvcReq": {}
  }*/

  let APIServices = this.config.APIServices;
      let response = {};
      this.loadingService.present();
      this.commonpostsignongatewayservice.init(request,APIServices[""].url).subscribe((data: any) => {
				if (data) {
          this.zeroOrders = data.SearchInfo.TotalNumberOfResult == 0;
          response = { "FilterType": this.selectedFilter, "Data": data };
          if (!this.zeroOrders) {
            this.viewCtrl.dismiss(response);
          }
				} else {
					
				}
				this.loadingService.dismiss();
			},
				(err: HttpErrorResponse) => {
					this.hasError = true;
					super.handleError(err);
					this.loadingService.dismiss();
				});   
    }

    this.otvcGatewayService.init().then(
  }
    
  

  ionViewDidLoad() {
    /*  this.lang = this.rootService.getLang();
     this.lob = this.rootService.getLOB(); */



  
  
  

  setInitData(otvcsetupCache) {
    var cachedData = otvcsetupCache.get('initData');
    this.modetype = this.otvcService.isUserLogIn() ? 'txn' : 'preTxn';
    if (isDefined(cachedData)) {
      this.skip = cachedData.RetrieveOtvcResp.Skip;
      this.setPageState(cachedData.RetrieveOtvcResp, cachedData.PageContentResp.Contents);
      if (isDefined(otvcsetupCache.get('confirmData'))) {
        this.confirmChange();
      }
    } else {
      this.otvcGatewayService.init(this.modetype).then(
        function (result) {
          this.loadingService.dismiss();
          this.setPageState(result.data.RetrieveOtvcResp, result.data.PageContentResp.Contents);
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

//   confirmChange() {
//     var confirmMessage = {
//     body : this.pageContent.text.completed,
//     button: this.pageContent.text.okButton
//   };
//     this.cibcLoading.hide();
//     this.cibcPopupFactory.alert(undefined, confirmMessage).then(function () {
//         var otvcsetupCache = this.CIBCCache.getCache('otvcsetupCache');
//         otvcsetupCache.remove('confirmData');
//     });
// }

  setPageState(otvcDetails, pageContent) {
    this.pageContent = pageContent;
    this.formValidationMessages = this.setUpFormValidationMessages(pageContent);
    this.pageState = this.otvcValidator.populateErrorModel(this.pageState);
    this.header = this.otvcService.isUserLogIn() ? pageContent.text.pageHeader1 : pageContent.text.pageHeader2;
    if (isDefined(otvcDetails.OtvcDetail)) {
        this.pageState.alwaysOtvc = otvcDetails.OtvcDetail.AlwaysOtvc;
        var contacts = otvcDetails.OtvcDetail.Contact;
        contacts.forEach(obj => {
            if (obj.Method != 'MOBILE_PHONE_TEXT') {
                this.pageState[obj.Method].value = obj.Method != 'EMAIL' ? this.toViewFormat(obj.Value) : obj.Value;
            }
        })
    }
    this.tooltipModal = this.modalctrl.create(pageContent, this.header);
    this.validateSubmit();
}

validateSubmit() {
  var validPhone = (isDefined(this.pageState.HOME_PHONE.value) || isDefined(this.pageState.MOBILE_PHONE.value) || isDefined(this.pageState.BUSINESS_PHONE.value));
  if (isDefined(this.pageState.EMAIL.value) && this.pageState.EMAIL.value != "") {
      this.isSubmit = this.validateEmail(this.pageState.EMAIL.value) && validPhone;
  } else {
      this.isSubmit = validPhone;
  }
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
          var compiled = _.template('(<%= area %>) <%= num1 %>');
          return compiled({ area: area, 'num1': num1 });
      }
      //e.g. 14165817080
      var area = modelPhone.substr(0, 3);
      var num1 = modelPhone.substr(3, 3);
      var num2 = modelPhone.substr(6);
      var compiled = _.template('(<%= area %>) <%= num1 %>-<%= num2 %>');
      return compiled({ area: area, 'num1': num1, 'num2': num2 });

  }
  //return null;
}

setUpFormValidationMessages(content) {
  let formValidationMessages = {};
  formValidationMessages = this.otvcValidator.populateErrorMessageModel(content.error);
  return formValidationMessages;
}

  cancel() {
    this.goToSignOn();
  }

  goToSignOn() {
    let _nextState = 'preTxn.signOn';
    let temp_stateParams = {
      lang: this.rootService.getLang(),
      lob: this.rootService.getLOB()
    };
    this.navCtrl.setRoot(_nextState, temp_stateParams);
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

  toSubmitFormat(modelPhone) {
    return modelPhone.replace(/[^0-9]/g, '');
  }

  next() {
    var OtvcContact = [];
    if (isDefined(this.pageState.MOBILE_PHONE.value)) {
      var mob =
      {
        "Value": this.toSubmitFormat(this.pageState.MOBILE_PHONE.value),
        "Method": "MOBILE_PHONE"
      }
      OtvcContact.push(mob);
    }
    if (isDefined(this.pageState.BUSINESS_PHONE.value)) {
      var mob = {
        "Value": this.toSubmitFormat(this.pageState.BUSINESS_PHONE.value),
        "Method": "BUSINESS_PHONE"
      }
      OtvcContact.push(mob);
    }
    if (isDefined(this.pageState.HOME_PHONE.value)) {
      var mob =
      {
        "Value": this.toSubmitFormat(this.pageState.HOME_PHONE.value),
        "Method": "HOME_PHONE"
      }
      OtvcContact.push(mob);
    }
    if (isDefined(this.pageState.EMAIL.value)) {
      var mob =
      {
        "Value": this.pageState.EMAIL.value,
        "Method": "EMAIL"
      }
      OtvcContact.push(mob);
    }

    var req = { "OtvcContact": OtvcContact, AlwaysOtvc: '' };
    if (isDefined(this.pageState.alwaysOtvc)) {
      req.AlwaysOtvc = this.pageState.alwaysOtvc;
    } else {
      req.AlwaysOtvc = "N";
    }
    // var safeErrorModel = new SafeObjectService.SafeObject(this.errorModel);
    // handleClearErrorModel(safeErrorModel.get('model').getUnsafe('$error'));

    // safeErrorModel = new SafeObjectService.SafeObject($scope.pageState);
    // handleClearErrorModel(safeErrorModel.get('MOBILE_PHONE').getUnsafe('$error'));
    // safeErrorModel = new SafeObjectService.SafeObject($scope.pageState);
    // handleClearErrorModel(safeErrorModel.get('BUSINESS_PHONE').getUnsafe('$error'));
    // safeErrorModel = new SafeObjectService.SafeObject($scope.pageState);
    // handleClearErrorModel(safeErrorModel.get('HOME_PHONE').getUnsafe('$error'));
    // safeErrorModel = new SafeObjectService.SafeObject($scope.pageState);
    // handleClearErrorModel(safeErrorModel.get('EMAIL').getUnsafe('$error'));
    this.isFormSubmit = true;

    //validate data
    var otvcValidation =
      this.otvcValidator.validate(this.pageState);
    //var hasError = this.formValidator.processValidationResults(otvcValidation);
  //  if (!hasError) {
      this.submitOtvc(req);
   // }
  }

  confirmChange() {
    var confirmMessage = {
      body: this.pageContent.text.completed,
      button: this.pageContent.text.okButton
    };
    this.loadingService.dismiss();
    this.cibcPopupFactory.alert(undefined, confirmMessage).then(function () {
      var otvcsetupCache = this.cibcCache.getCache('otvcsetupCache');
      otvcsetupCache.remove('confirmData');
    });
  }

  submitOtvc(req) {
    this.otvcGatewayService.validate(req).then(
      function (result) {

        if (!isDefined(result.data.ValidateOtvcDetailRes)) {
          this.completed = true;
          this.cibcLoading.hide();
          this.confirmChange();
        } else {
          var nextState = (this.modetype == 'txn') ? 'txn.OTVC' : 'preTxn.OTVC';
          this.cibcLoading.hide();
          this.navCtrl.setRoot(nextState);
        }
      },
      function (completionStatus) {
        if (completionStatus.reason === 'ERR_Page_Error') {
          this.errorModel = completionStatus.errorModel;
          // 	var eCode = failureResult.data.Exception.ErrorCode;
          // 	if (eCode === "MBUSRSC0174") {
          // 		OmnitureUtil.sendErrorPageName("Sign On>Electronic Access Agreements Error");
          // 	}
          // 	if (eCode === "MBUIMSG002") {
          // 		OmnitureUtil.sendErrorPageName("Sign On>Exchange Agreements Error");
          // 	}

          // 	if (eCode === "MBUIMSG001" || eCode === "MBUIMSG002" || eCode === "MBUIMSG0025"  || eCode === 'BUSSC7247' || eCode === 'MBUIMSG004' || eCode === 'MBBUSSC0025' || eCode === 'MBBUSSC0026' || eCode === 'MBUSRFA0001' || eCode  === 'MBUSRFA0004') {
          // 		var signonCache = CIBCCache.getCache('signonCache');
          // 		signonCache.put('errorPVQData', failureResult);
          // 		goToSignOn();
          // 	}
          // 	initializePage(true);
          // }else if(completionStatus.reason==='ERR_Form_Validation'){
          //     processRESTFormErrors(completionStatus.errors);
          // }
          this.loadingService.dismiss();
          //to-do:wrong usage
          //onCompletion.reject(completionStatus);
        }
      });
    this.loadingService.present();
  }

  skipotvc() {
    this.otvcGatewayService.skip('code').then(
      function (result) {
        this.loadingService.dismiss();
        // @ifdef DEBUG 
        console.log('Success callback of OTVC verify');
        console.log('result=');
        console.log(JSON.stringify(result));
        // @endif
        var otvcCache = this.cibcCache.getCache('otvcsetupCache');
        var cachedData = otvcCache.get('verifyOTVCData');
        this.commonGatewayService.goTo(cachedData.NextPage);
        return false;
      },

      function (failureResult) {
        // @ifdef DEBUG
        console.log('Error callback of touch id settings init. failureResult=');
        console.log(JSON.stringify(failureResult));
        // @endif
       // var errorProcessor = this.restErrorProcessor.getCrossFlowTransitionErrProcessor(failureResult);
       var errorProcessor = this.reportingErrorHandler.handleError(failureResult);
        errorProcessor
          .process()
          .resolve();
        this.loadingService.dismiss();
      });
    this.loadingService.present();
  }

  openEmailInfo() {
    this.tooltipModal.present();
  }
}
}
