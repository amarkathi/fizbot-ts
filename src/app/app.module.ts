import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ResponsesComponent } from './responses/responses.component';
import {UserQuestionComponent} from "./user-question/user-question.component";
import {HttpModule} from "@angular/http";
import {HttpClientModule} from "@angular/common/http";
import {WatsonAPIService} from "./shared/services/watson-api.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ResponsesComponent,
    UserQuestionComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule
  ],
  providers: [WatsonAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
