import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {ResponsesService} from "../shared/responses.service";
import {DataService} from "../shared/data.service";
import {WatsonAPIService} from "../shared/services/watson-api.service";
import {MessageResponse} from "../shared/models/assistant/v1";
import * as AssistantV1 from "../shared/models/assistant/v1";
import {IConversation} from "../shared/models/watson-models";

@Component({
  selector: 'app-user-question',
  templateUrl: './user-question.component.html',
  styleUrls: ['./user-question.component.css', '../../assets/stylesheets/chatbot.css']
})
export class UserQuestionComponent implements OnInit {

  conversation: IConversation = {
    exchanges: [],
    status: 'NotStarted'
  };

  @Output()
  userQuestion: EventEmitter<string> = new EventEmitter();

  constructor(private responsesService: ResponsesService) { }

  ngOnInit() {
  }

  processUserInput(userInput: string) {

    this.userQuestion.emit(userInput);

    //TODO read csv file here
    var reader = new FileReader();

    if (userInput) {
      this.responsesService.sendMessage(userInput);
    } else {
      this.responsesService.sendMessage('would you like to end the conversation?') ;
    }
  }

  sendMessage() {
  }
  clearMessages(): void {

  }
}
