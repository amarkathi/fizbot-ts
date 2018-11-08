import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent } from './header/header.component';
import { ResponsesComponent } from './responses/responses.component';
import { UserQuestionComponent } from './user-question/user-question.component';
import { HttpClientModule } from '@angular/common/http';
import { WatsonAPIService } from './shared/services/watson-api.service';
import { RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
  {path: 'fisbot', component: AppComponent}

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ResponsesComponent,
    UserQuestionComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [WatsonAPIService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
