import {Component, Output, OnInit, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-user-question',
  templateUrl: './user-question.component.html',
  styleUrls: ['./user-question.component.css', '../../assets/stylesheets/chatbot.css']
})
export class UserQuestionComponent implements OnInit {

  @Output() public childEvent = new EventEmitter();
  userInput: string;
  constructor() { }

  ngOnInit() {
  }

  processUserInput(userInput: string) {
    this.userInput = userInput;
    console.log(this.userInput);
  }

  fireEvent(userInput: string) {
    this.userInput = userInput;
    this.childEvent.emit(this.userInput) ;
  }
}
