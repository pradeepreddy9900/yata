import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlyingHeroesComponentComponent } from './flying-heroes-component.component';

describe('FlyingHeroesComponentComponent', () => {
  let component: FlyingHeroesComponentComponent;
  let fixture: ComponentFixture<FlyingHeroesComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlyingHeroesComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlyingHeroesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
