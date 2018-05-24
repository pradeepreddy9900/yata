import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Hero } from './hero';
//import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
@Injectable({
  providedIn: 'root'
})
export class HeroService {
    constructor(private messageService: MessageService, private http: HttpClient) { }
    private heroesUrl = 'api/heroes';
    private log(message: string) {
        this.messageService.add('HeroService: ' + message);
    }
    
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {    
            console.error(error); // log to console instead
 
            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);
         
            // Let the app keep running by returning an empty result.
            return of(result as T);
            }
    }

    getHeroes(): Observable<Hero[]> {
       // return of(HEROES);
        return this.http.get<Hero[]>(this.heroesUrl)
                .pipe(
                       tap(heroes => this.log('fetched heroes')),
                       catchError(this.handleError('getHeroes', [])),
                    )
    }
    
    updateHero(hero: Hero): Observable<any>{
        return this.http.put(this.heroesUrl, hero, httpOptions)
                    .pipe(
                            tap(_ => this.log(`update hero id=${hero.id}`)),
                            catchError(this.handleError<any>('Update Hero'))
                       )
    }
    
    addHero(hero: Hero): Observable<Hero>{
        return this.http.post(this.heroesUrl, hero, httpOptions)
                .pipe(
                    tap((hero: Hero) => this.log(`addd hero id=${hero.id}`)),
                    catchError(this.handleError<Hero>('add Hero'))                    
                    )
     }
     
     deleteHero(hero: Hero): Observable<Hero> {
         const id = hero.id;
        const url = `${this.heroesUrl}/${id}`; 
         return this.http.delete<Hero>(url, httpOptions)
                .pipe(
                    tap(_ => this.log(`deleted hero id=${id}`)),
                    catchError(this.handleError<Hero>('deleteHero'))
                    )

     }
    
    searchHeroes(term: string): Observable<Hero[]>{
        if(!term.trim()){
            return of([]);    
        }
        return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
                tap(_ => this.log(`found heroes matching ${term}`)),
                catchError(this.handleError<Hero[]>('searchHeroes', []))
            )    
    }
    
    getHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        //return of(HEROES.find(hero => hero.id === id));
        return this.http.get<Hero>(url)
                .pipe(
                    tap(_ => this.log(`fetched hero ${id}`)),
                    catchError(this.handleError<Hero>(`getHero id=${id}`)),
                    );
    }
}
