import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {MessageResponse} from "./models/assistant/v1";
import {WatsonAPIService} from "./services/watson-api.service";
import {IConversation} from "./models/watson-models";

@Injectable({
  providedIn: 'root'
})
export class ResponsesService {

  conversation: IConversation = {
    exchanges: [],
    status: 'NotStarted'
  };

  constructor (private watsonAPIService: WatsonAPIService) { }

  private subject = new Subject<any>();

  sendMessage(userInput: string){
    this.watsonAPIService.sendMessage(userInput).then(message => {
      this.conversation.exchanges.push({
        message: userInput,
        response: message,
        time: new Date()
      });
      if(message != undefined){
        this.subject.next({ text:message });
      }else{
        this.subject.next('Echoing....'+userInput);
      }
    });
   console.log(this.conversation.exchanges);
  }

  clearResponses(){
  }

  getResponses(): Observable<any> {
    return this.subject.asObservable();
  }
}
