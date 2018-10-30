import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {MessageResponse} from "./models/assistant/v1";

@Injectable({
  providedIn: 'root'
})
export class ResponsesService {

  private subject = new Subject<any>();

  sendMessage(message: string){
    this.subject.next({text:message});
  }

  clearResponses(){
  }

  getResponses(): Observable<any> {
    return this.subject.asObservable();
  }
}
