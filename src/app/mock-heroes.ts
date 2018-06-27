import { Hero } from './hero';

export interface Flyer { canFly: boolean; }
export const HEROES:Hero[] = [
        {id:1, name: 'praveen'},
        {id:2, name: 'madhava reddy'},
        {id:3, name: 'manasa'},
        {id:4, name: 'kalavathi'},
];
export const MockHeroes = [
        {id:1, name: 'praveen', canFly: true},
        {id:2, name: 'madhava reddy', canFly: false},
        {id:3, name: 'manasa', canFly: false},
        {id:4, name: 'kalavathi', canFly: true},
];