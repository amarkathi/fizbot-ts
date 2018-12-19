import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {ResponsesService} from "../shared/services/responses.service";
import {Subscription} from "rxjs";
import * as $ from 'jquery' ;
import { IExchange, IConversation } from '../shared/models/watson-models';


@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.css']
})
export class ResponsesComponent implements OnInit, OnDestroy {

  message: string;
  subscription: Subscription;
  userIncomingQuestion: string;
  greeting: string;


  conversation: IConversation = {
    exchanges: [],
    status: 'NotStarted'
  };

  @Output()
  userQuestion: EventEmitter<string> = new EventEmitter();

  ngOnInit() {

    $(document).ready(function(){
      console.log('Started the application');
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  constructor(private responsesService: ResponsesService) {
   //subscribe to user question component
    this.subscription = this.responsesService.getResponses().subscribe(
        conversation => {
          this.conversation = conversation;
          let height: number = 0;
          $('#chatbotResponse').animate({scrollTop: 100000000 }, 'smooth');
        });

  }

  @Input() set   incomingUserQuestion(value: string) {
    if (value && value != undefined) {
      console.log('in the response component');
      this.userIncomingQuestion = value;
    }
  }

  processUserInput(userInput: string) {

    this.userQuestion.emit(userInput);

    if (userInput) {
      this.responsesService.sendMessage(userInput);
    }else{
      this.responsesService.sendMessage('');
    }
  }
  processThumbsDown() {

    const userInput2 = this.conversation.exchanges[this.conversation.exchanges.length-1].message;

    this.userQuestion.emit(userInput2);

    if (userInput2) {
      this.responsesService.sendMessage(userInput2);
    } else {
      this.responsesService.sendMessage('') ;
    }
  }
 }
