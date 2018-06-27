import { Component, OnInit } from '@angular/core';
import { MockHeroes } from '../mock-heroes';

@Component({
  selector: 'app-flying-heroes-component',
  templateUrl: './flying-heroes-component.component.html',
  styleUrls: ['./flying-heroes-component.component.css']
})
export class FlyingHeroesComponentComponent implements OnInit {
   
  constructor() { this.reset();}

  ngOnInit() {
  }
    
    heroes: any[] = [];
    canFly = true;
    mutate = false;
    title = "Flying Heroes exmaple";
   addHero(name: string) {
    name = name.trim();
    if (!name) { return; }
    let hero = {name, canFly: this.canFly};
    if (this.mutate) {
    // Pure pipe won't update display because heroes array reference is unchanged
    // Impure pipe will display
    this.heroes.push(hero);
    } else {
      // Pipe updates display because heroes array is a new object
      this.heroes = this.heroes.concat(hero);
    }
  }
    
    reset() {
        this.heroes = MockHeroes.slice();    
    }
    
    

}
