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
  clearSubscription: Subscription;
  userIncomingQuestion: string;
  greeting: string;

  conversation: IConversation = {
    exchanges: [],
    status: 'NotStarted'
  };

  @Output()
  userQuestion: EventEmitter<string> = new EventEmitter();

  ngOnInit() {
    this.greeting = 'Good Morning';
    var hours = new Date().getHours();
    var hours = (hours+24)%24;
    var mid='am';
    console.log('hours..........'+hours);

    if(hours==0){ //At 00 hours we need to show 12 am
      hours=12;
    }
    else if(hours>12)
    {
      hours=hours%12;
      mid='pm';
      this.greeting = 'Good Evening';
    }


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
    } else {
      this.responsesService.sendMessage('would you like to end the conversation?') ;
    }
  }

  clearResponses(){
    //subscribe to user question component
    this.clearSubscription = this.responsesService.clearResponses().subscribe(
      conversation => {this.conversation = conversation});
  }
 }
