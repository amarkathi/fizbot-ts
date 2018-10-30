import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FI$Bot';

  userQuestion: string;

  userQuestionHandler(event: string) {
    console.log(event+' is assigned');
    this.userQuestion = event;
  }
}
