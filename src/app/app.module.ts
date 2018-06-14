import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data-service';

import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroSearchComponent } from './hero-search/hero-search.component';
import { AdBannerDirective } from './ad-banner.directive';
import { AdBannerComponent } from './ad-banner/ad-banner.component';
import { HeroProfileComponent } from './hero-profile.component';
import { HeroJobAdComponent } from './hero-job-ad.component';
import { HighlightDirective } from './highlight.directive';
import { ExponentialStrengthPipe } from './exponential-strength.pipe';
import { PowerBoostCalculatorComponent } from './power-boost-calculator/power-boost-calculator.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    DashboardComponent,
    HeroSearchComponent,
    AdBannerDirective,
    AdBannerComponent,
    HeroJobAdComponent,
    HeroProfileComponent,
    HighlightDirective,
    ExponentialStrengthPipe,
    PowerBoostCalculatorComponent
  ],
  entryComponents: [ HeroJobAdComponent, HeroProfileComponent ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
