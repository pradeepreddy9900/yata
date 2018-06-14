import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ad-host]'
})
export class AdBannerDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }

}
