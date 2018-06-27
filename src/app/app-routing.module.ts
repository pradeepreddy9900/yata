import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { PowerBoostCalculatorComponent } from './power-boost-calculator/power-boost-calculator.component';
import { FlyingHeroesComponentComponent } from './flying-heroes-component/flying-heroes-component.component';

const routes: Routes = [{path: 'heroes', component: HeroesComponent},
                        {path: 'dashboard', component: DashboardComponent},
                        {path: 'detail/:id', component: HeroDetailComponent},
                        {path: 'pipes', component: PowerBoostCalculatorComponent},
                        {path: 'advancedpipes', component: FlyingHeroesComponentComponent},
                        {path: '', component: DashboardComponent, pathMatch: 'full'}];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
