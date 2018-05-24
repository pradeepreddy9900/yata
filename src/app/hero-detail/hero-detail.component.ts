import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
    @Input() hero: Hero;
  //  @Output() deleteRequest = new EventEmitter<Hero>();
    
    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private heroService: HeroService
    ) { }

    getHero(): void {
        const id = +this.route.snapshot.paramMap.get('id');
        this.heroService.getHero(id)
            .subscribe(hero => this.hero = hero);
    }
    goBack(): void {
        this.location.back();    
    }
    save(): void {
            this.heroService.updateHero(this.hero)
            .subscribe(() => this.goBack());
        }
    
    /**deleteHero(): void {
        this.deleteRequest.emit(this.hero);
    }*/
    
    ngOnInit() {
        this.getHero();
    }

}
