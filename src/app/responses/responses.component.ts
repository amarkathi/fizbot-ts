import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ResponsesService} from "../shared/responses.service";
import {Subscription} from "rxjs";
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

  conversation: IConversation = {
    exchanges: [],
    status: 'NotStarted'
  };

  ngOnInit() {
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  constructor(private responsesService: ResponsesService) {
    //subscribe to user question component
    this.subscription = this.responsesService.getResponses().subscribe(message => {this.message = message;});
  }

  @Input() set   incomingUserQuestion(value: string) {
    if (value && value != undefined) {
      console.log('in the response component');
      this.userIncomingQuestion = value;
    }
  }

 }
