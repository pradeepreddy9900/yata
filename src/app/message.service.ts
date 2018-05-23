import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
    messages: string[] = [];
    add = function(message: string) {
        this.messages.push(message);
    }
    clear = function() {
        this.messages = [];
    }
    constructor() { }
}
