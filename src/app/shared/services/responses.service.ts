import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {MessageResponse} from "../models/assistant/v1";
import {WatsonAPIService} from "./watson-api.service";
import {IConversation} from "../models/watson-models";

@Injectable({
  providedIn: 'root'
})
export class ResponsesService {

  conversation: IConversation = {
    exchanges: [],
    status: 'NotStarted'
  };

  constructor (private watsonAPIService: WatsonAPIService) { }

  private subject = new Subject<IConversation>();

  sendMessage(userInput: string){
    this.watsonAPIService.sendMessage(userInput).then(messageResponse => {

      this.conversation.exchanges.push({
        message: messageResponse.message,
        response: messageResponse.response,
        intent: messageResponse.intent,
        time: new Date()

      });
      this.subject.next(this.conversation);
    });
  }

  clearResponses(){

    let conversation: IConversation ={
      exchanges: [],
      status: 'NotStarted'
    };
    this.conversation = conversation;
    this.subject.next(conversation);
    return this.subject.asObservable();
  }

  getResponses(): Observable<IConversation> {
    return this.subject.asObservable();
  }
}
