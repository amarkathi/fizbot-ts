import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as $ from 'jquery';
import {ResponsesService} from "../shared/services/responses.service";
import {Subscription} from "rxjs";
import {IConversation} from "../shared/models/watson-models";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private clearSubscription: Subscription;

  @Output()
  userQuestion: EventEmitter<string> = new EventEmitter();

  conversation: IConversation = {
    exchanges: [],
    status: 'NotStarted'
  };

  constructor(private responseService: ResponsesService) {}

  ngOnInit() {
  }

  clearResponses(){
    //subscribe to user question component
    this.clearSubscription = this.responseService.clearResponses().subscribe(
      conversation => {this.conversation = conversation});
  }
  processThumbsDown() {

    //const userInput2 = this.conversation.exchanges[this.conversation.exchanges.length-1].message;

    const userInput2 = "fiscal help";

    this.userQuestion.emit(userInput2);

    if (userInput2) {
      this.responseService.sendMessage(userInput2);
    } else {
      this.responseService.sendMessage('would you like to end the conversation?') ;
    }
  }

}
