import { Injectable } from '@angular/core';
import { isDefined, isUndefined } from 'ionic-angular/util/util';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { HttpErrorResponse } from '@angular/common/http';
import { Phone_ErrorMessages } from './otvcError';
import { FormValidatorFactory } from '../../../services/formvalidator/cibc.formvalidator';

@Injectable()
export class OtvcValidatorService {
  Phone_ErrorMessages: Phone_ErrorMessages;
  constructor(public http: HttpClient) {

  }

  populateErrorModel(formModel) {

    formModel.MOBILE_PHONE = {};
    formModel.MOBILE_PHONE.$error = {};
    formModel.MOBILE_PHONE.$value = {};
    formModel.MOBILE_PHONE.$error[this.Phone_ErrorMessages.MSG_8_INVALID_PHONE] = false;
    formModel.MOBILE_PHONE.$error.hasError = false;

    formModel.BUSINESS_PHONE = {};
    formModel.BUSINESS_PHONE.$error = {};
    formModel.BUSINESS_PHONE.$value = {};
    formModel.BUSINESS_PHONE.$error[this.Phone_ErrorMessages.MSG_8_INVALID_PHONE] = false;
    formModel.BUSINESS_PHONE.$error.hasError = false;

    formModel.HOME_PHONE = {}
    formModel.HOME_PHONE.$error = {};
    formModel.HOME_PHONE.$value = {};
    formModel.HOME_PHONE.$error[this.Phone_ErrorMessages.MSG_8_INVALID_PHONE] = false;
    formModel.HOME_PHONE.$error.hasError = false;

    formModel.EMAIL = {};
    formModel.EMAIL.$error = {};
    formModel.EMAIL.$value = {};
    formModel.EMAIL.$error[this.Phone_ErrorMessages.MSG_8_INVALID_PHONE] = false;
    formModel.EMAIL.$error.hasError = false;

    return formModel;
  }

  populateErrorMessageModel(errContent) {
    var mobileMessages =
      [
        {
          text: errContent.MSGOTV008,
          code: this.Phone_ErrorMessages.MSG_8_INVALID_PHONE
        }
      ];

    var homeMessages =
      [
        {
          text: errContent.MSGOTV008,
          code: this.Phone_ErrorMessages.MSG_8_INVALID_PHONE
        }
      ];
    var businessMessages =
      [
        {
          text: errContent.MSGOTV008,
          code: this.Phone_ErrorMessages.MSG_8_INVALID_PHONE
        }
      ];
    var emailMessages =
      [
        {
          text: errContent.MSGOTV008,
          code: this.Phone_ErrorMessages.MSG_8_INVALID_PHONE
        }
      ];

    let otvcMessages = {
      MOBILE_PHONE: mobileMessages,
      HOME_PHONE: homeMessages,
      BUSINESS_PHONE: businessMessages,
      MAIL: emailMessages
    };

    return otvcMessages;
  }

  addRuntimeError(fieldName, error, formModel, messageModel) {
    //messageModel.passwordMessages = {};
    var displayMessage = {
      text: error.errorMessage(),
      code: error.errorCode(),
      reference: error.errorCode()
    };

    if (fieldName.includes('Password')) {
      formModel.password.$error[error.errorCode()] = true;
      formModel.password.$error.hasError = true;
      if (!this.containsObject(displayMessage, messageModel.passwordMessages)) { messageModel.passwordMessages.push(displayMessage); }
    }
  }

  containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].text === obj.text) {
        return true;
      }
    }
    return false;
  }

  validate(selectionData) {
    var rVal = [];
    var otvcErrorObj = {
      results: this.validatePhone(selectionData.MOBILE_PHONE.value),
      errorModel: selectionData.MOBILE_PHONE.$error
    };
    rVal.push(otvcErrorObj);
    var otvcErrorObj = {
      results: this.validatePhone(selectionData.BUSINESS_PHONE.value),
      errorModel: selectionData.BUSINESS_PHONE.$error
    };
    rVal.push(otvcErrorObj);
    var otvcErrorObj = {
      results: this.validatePhone(selectionData.HOME_PHONE.value),
      errorModel: selectionData.HOME_PHONE.$error
    };
    rVal.push(otvcErrorObj);
    // var otvcErrorObj = {};
    // otvcErrorObj.results = validateEmail(selectionData.EMAIL.value);
    // otvcErrorObj.errorModel = selectionData.EMAIL.$error;
    // rVal.push(otvcErrorObj);
    return rVal;
  }

  validatePhone(phone) {
    return true;
    var phoneNumberValidator = new FormValidatorFactory.createFormDataValidator(phone);
    var phoneValidator = new FormValidatorFactory.createPhoneNumberValidator();
    phoneNumberValidator.add(phoneValidator, this.Phone_ErrorMessages.MSG_8_INVALID_PHONE);
    return phoneNumberValidator.validate();
  
  }


}