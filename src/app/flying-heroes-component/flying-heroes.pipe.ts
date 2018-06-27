import { Pipe, PipeTransform } from '@angular/core';
import { MockHeroes } from '../mock-heroes';

@Pipe({name:"flyingHeroes"})
export class FlyingHeroesPipe implements PipeTransform {
        transform(allHeroes: MockHeroes[]){
            return allHeroes.filter(hero => hero.canFly);    
        }
    }