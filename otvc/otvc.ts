import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AnonymousSubject } from 'rxjs';
import { OtvcValidatorService } from './validation/otvcValidatorService';
/*

"CIBCLoading", "RESTErrorProcessor",
        "OTVCService", "OTVCGatewayService", 'CIBCCache', "$state", "TooltipModalService",
        "otvcValidatorService", "CIBCPopupFactory", "commonGatewayService", "SafeObjectService", "FormValidator"
*/        
/**
 * Generated class for the OtvcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: 'otvc', segment: '/otvc'})
@Component({
  selector: 'page-otvc',
  templateUrl: 'otvc.html',
})
export class OtvcPage {
  
  
  constructor(public otvcValidatorService:OtvcValidatorService, public navCtrl: NavController, public navParams: NavParams) {
  }

  userName:any;
  rootScope:any={};
  isMenuOpen = false;
  pageName = 'TouchID';
  pageState = {};
  isSubmit = false;
  tooltipModal:any;
  completed = false;
/*
  constructor(  CIBCLoading, RESTErrorProcessor,
    OTVCService, OTVCGatewayService, CIBCCache, $state, TooltipModalService,
    otvcValidatorService, CIBCPopupFactory, commonGatewayService, SafeObjectService, FormValidator  )
*/
 
        
        initialize();

         initialize() {
            let pageState = {};
            var otvcsetupCache = CIBCCache.getCache('otvcsetupCache');
            setInitData(otvcsetupCache);
        }

         setInitData(otvcsetupCache) {
            var cachedData = otvcsetupCache.get('initData');
            $scope.modetype = OTVCService.isUserLogIn() ? 'txn' : 'preTxn';
            if (angular.isDefined(cachedData)) {
                $scope.skip = cachedData.RetrieveOtvcResp.Skip;
                setPageState(cachedData.RetrieveOtvcResp, cachedData.PageContentResp.Contents);
                if (angular.isDefined(otvcsetupCache.get('confirmData'))) {
                    confirmChange();
                }
            } else {
                OTVCGatewayService.init($scope.modetype).then(
                    function (result) {
                        CIBCLoading.hide();
                        setPageState(result.data.RetrieveOtvcResp, result.data.PageContentResp.Contents);
                    },

                    function (failureResult) {
                        // @ifdef DEBUG
                        console.log('Error callback of touch id settings init. failureResult=');
                        console.log(JSON.stringify(failureResult));
                        // @endif

                        var errorProcessor = RESTErrorProcessor.getCrossFlowTransitionErrProcessor(failureResult);

                        errorProcessor
                            .process()
                            .resolve();

                        CIBCLoading.hide();
                    });
                CIBCLoading.show();
            };
        }

         setPageState(otvcDetails, pageContent) {
            $scope.pageContent = pageContent;
            $scope.formValidationMessages = setUpFormValidationMessages(pageContent);
            $scope.pageState = otvcValidator.populateErrorModel($scope.pageState);
            $scope.header = OTVCService.isUserLogIn() ? pageContent.text.pageHeader1 : pageContent.text.pageHeader2;
            if (angular.isDefined(otvcDetails.OtvcDetail)) {
                $scope.pageState.alwaysOtvc = otvcDetails.OtvcDetail.AlwaysOtvc;
                var contacts = otvcDetails.OtvcDetail.Contact;
                contacts.forEach(obj => {
                    if (obj.Method != 'MOBILE_PHONE_TEXT') {
                        $scope.pageState[obj.Method].value = obj.Method != 'EMAIL' ? toViewFormat(obj.Value) : obj.Value;
                    }
                })
            }
            tooltipModal = new TooltipModalService.createModal(pageContent, $scope.header);
            validateSubmit();
        }

         cancel() {
            goToSignOn();
        }
         skipotvc() {
            OTVCGatewayService.skip().then(
                function (result) {
                    CIBCLoading.hide();
                    // @ifdef DEBUG 
                    console.log('Success callback of OTVC verify');
                    console.log('result=');
                    console.log(JSON.stringify(result));
                    // @endif
                    var otvcCache = CIBCCache.getCache('otvcsetupCache');
                    var cachedData = otvcCache.get('verifyOTVCData');
                    commonGatewayService.goTo(cachedData.NextPage);
                    return false;
                },

                function (failureResult) {
                    // @ifdef DEBUG
                    console.log('Error callback of touch id settings init. failureResult=');
                    console.log(JSON.stringify(failureResult));
                    // @endif
                    var errorProcessor = RESTErrorProcessor.getCrossFlowTransitionErrProcessor(failureResult);
                    errorProcessor
                        .process()
                        .resolve();
                    CIBCLoading.hide();
                });
            CIBCLoading.show();
        }
         goToSignOn() {
            var _nextState = 'preTxn.signOn';
            var temp_stateParams = {
                lang: $rootScope.lang,
                lob: $rootScope.LOB
            };
            $state.transitionTo(_nextState, temp_stateParams);
        }

         toViewFormat(modelPhone) {
            modelPhone = modelPhone.replace(/[^0-9]/g, '');
            validateSubmit();
            if (modelPhone) {
                // $scope.isSubmit = angular.isDefined($scope.pageState.EMAIL.value)?validateEmail($scope.pageState.EMAIL.value):true;  
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

         toSubmitFormat(modelPhone) {
            return modelPhone.replace(/[^0-9]/g, '');
        }
         validateSubmit() {
            var validPhone = (angular.isDefined($scope.pageState.HOME_PHONE.value) || angular.isDefined($scope.pageState.MOBILE_PHONE.value) || angular.isDefined($scope.pageState.BUSINESS_PHONE.value));
            if (angular.isDefined($scope.pageState.EMAIL.value) && $scope.pageState.EMAIL.value != "") {
                $scope.isSubmit = validateEmail($scope.pageState.EMAIL.value) && validPhone;
            } else {
                $scope.isSubmit = validPhone;
            }
        }

         next() {
            var OtvcContact = [];
            if (angular.isDefined($scope.pageState.MOBILE_PHONE.value)) {
                var mob =
                {
                    "Value": toSubmitFormat($scope.pageState.MOBILE_PHONE.value),
                    "Method": "MOBILE_PHONE"
                }
                OtvcContact.push(mob);
            }
            if (angular.isDefined($scope.pageState.BUSINESS_PHONE.value)) {
                var mob = {
                    "Value": toSubmitFormat($scope.pageState.BUSINESS_PHONE.value),
                    "Method": "BUSINESS_PHONE"
                }
                OtvcContact.push(mob);
            }
            if (angular.isDefined($scope.pageState.HOME_PHONE.value)) {
                var mob =
                {
                    "Value": toSubmitFormat($scope.pageState.HOME_PHONE.value),
                    "Method": "HOME_PHONE"
                }
                OtvcContact.push(mob);
            }
            if (angular.isDefined($scope.pageState.EMAIL.value)) {
                var mob =
                {
                    "Value": $scope.pageState.EMAIL.value,
                    "Method": "EMAIL"
                }
                OtvcContact.push(mob);
            }

            var req = { "OtvcContact": OtvcContact };
            if (angular.isDefined($scope.pageState.alwaysOtvc)) {
                req.AlwaysOtvc = $scope.pageState.alwaysOtvc;
            } else {
                req.AlwaysOtvc = "N";
            }
            var safeErrorModel = new SafeObjectService.SafeObject($scope.errorModel);
            handleClearErrorModel(safeErrorModel.get('model').getUnsafe('$error'));

            safeErrorModel = new SafeObjectService.SafeObject($scope.pageState);
            handleClearErrorModel(safeErrorModel.get('MOBILE_PHONE').getUnsafe('$error'));
            safeErrorModel = new SafeObjectService.SafeObject($scope.pageState);
            handleClearErrorModel(safeErrorModel.get('BUSINESS_PHONE').getUnsafe('$error'));
            safeErrorModel = new SafeObjectService.SafeObject($scope.pageState);
            handleClearErrorModel(safeErrorModel.get('HOME_PHONE').getUnsafe('$error'));
            safeErrorModel = new SafeObjectService.SafeObject($scope.pageState);
            handleClearErrorModel(safeErrorModel.get('EMAIL').getUnsafe('$error'));
            $scope.isFormSubmit = true;

            //validate data
            var otvcValidation =
                otvcValidator.validate($scope.pageState);
            var hasError = FormValidator.processValidationResults(otvcValidation);
            if (!hasError) {
                submitOtvc(req);
            }
        }


         submitOtvc(req) {
            OTVCGatewayService.validate(req).then(
                function (result) {

                    if (!angular.isDefined(result.data.ValidateOtvcDetailRes)) {
                        $scope.completed = true;
                        CIBCLoading.hide();
                        confirmChange();
                    } else {
                        var nextState = ($scope.modetype == 'txn') ? 'txn.OTVC' : 'preTxn.OTVC';
                        CIBCLoading.hide();
                        $state.transitionTo(nextState);
                    }
                },
                function (completionStatus) {
                    if (completionStatus.reason === 'ERR_Page_Error') {
                        $scope.errorModel = completionStatus.errorModel;
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
                        CIBCLoading.hide();
                        onCompletion.reject(completionStatus);
                    }
                });
            CIBCLoading.show();
        }

        /** 
		    Expose method to html to allow form items to clear the error showing above it.
	        @public
	        @param {object} errorModel. The ErrorModel to clear
       */
         handleClearErrorModel(errorModel) {
            var errKeys = Object.keys(errorModel);
            errKeys.map(function (key) {
                if (typeof errorModel[key] === 'boolean') {
                    errorModel[key] = false;
                }
            });
        }

         confirmChange() {
            var confirmMessage = {};
            confirmMessage.body = $scope.pageContent.text.completed;
            confirmMessage.button = $scope.pageContent.text.okButton;
            CIBCLoading.hide();
            CIBCPopupFactory.alert(undefined, confirmMessage).then(function () {
                var otvcsetupCache = CIBCCache.getCache('otvcsetupCache');
                otvcsetupCache.remove('confirmData');
            });
        }
         validateEmail(email) {
            var passWhitelist = false;
            var INVERSE_WHITELIST = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            if (angular.isDefined(email) && email != "") {
                passWhitelist = !(email.match(INVERSE_WHITELIST) === null);
                $scope.isSubmit = passWhitelist;
                return passWhitelist;
            } else {   
                $scope.isSubmit = (angular.isDefined($scope.pageState.HOME_PHONE.value) || angular.isDefined($scope.pageState.MOBILE_PHONE.value) || angular.isDefined($scope.pageState.BUSINESS_PHONE.value));             
                return $scope.isSubmit;
            }
        }


         openEmailInfo() {
            tooltipModal.openModal();
        }

         setUpFormValidationMessages(content) {
            var formValidationMessages = {};
            formValidationMessages = otvcValidator.populateErrorMessageModel(content.error);
            return formValidationMessages;
        }








  ionViewDidLoad() {
    console.log('ionViewDidLoad OtvcPage');
  }

}
