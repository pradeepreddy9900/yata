import { Injectable } from '@angular/core';
import { HeroProfileComponent } from './hero-profile.component';
import { HeroJobAdComponent } from './hero-job-ad.component';
import { AdItem } from './ad-item'; 

@Injectable({
  providedIn: 'root'
})
export class AdService {

  getAds(){
    return [
        new AdItem(HeroProfileComponent, {name:'praveen Reddy karnati', bio:'AngularJS developer'}),    
        new AdItem(HeroProfileComponent, {name:'Madhava reddy karnati', bio:'Govt Employee in Telangana'}),    
        new AdItem(HeroJobAdComponent, {headline:'praveen Reddy karnati', body:'AngularJS developer'}),    
        new AdItem(HeroJobAdComponent, {headline:'madhava reddy karnati', body:'TSRTC Employee'}),    
    ];    
  }
}
