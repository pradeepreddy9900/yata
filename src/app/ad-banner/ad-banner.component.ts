import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { AdItem } from '../ad-item';
import { AdBannerDirective } from '../ad-banner.directive';
import { AdComponent } from '../ad.component';

@Component({
  selector: 'app-ad-banner',
  templateUrl: './ad-banner.component.html',
  styleUrls: ['./ad-banner.component.css']
})
export class AdBannerComponent implements OnInit, OnDestroy {
  @Input() ads: AdItem[];
  currentAdIndex = -1;
  interval: any;
    
  @ViewChild(AdBannerDirective) adHost: AdBannerDirective;
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
      this.loadComponent();
      this.getAds();
  }
  
  ngOnDestroy() {
    clearInterval(this.interval);            
  }
      
  getAds(): void {
        this.interval = setInterval(() => {
            this.loadComponent();    
        }, 3000);
      }
  loadComponent() {
         this.currentAdIndex = (this.currentAdIndex+1) % this.ads.length;
         let adItem = this.ads[this.currentAdIndex];
         let componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem.component);
         let viewContainerRef = this.adHost.viewContainerRef;
         viewContainerRef.clear();
         let componentRef = viewContainerRef.createComponent(componentFactory);
          (<AdComponent>componentRef.instance).data = adItem.data;       
  }

}
