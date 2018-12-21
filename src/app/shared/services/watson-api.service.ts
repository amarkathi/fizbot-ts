import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as AssistantV1 from '../models/assistant/v1';
import {MessageResponse} from '../models/assistant/v1';
import {IExchange} from "../models/watson-models";
import {environment} from '../../../environments/environment';

@Injectable()
export class WatsonAPIService {

  private version = '2018-09-20';

  private workspace_id = environment.workspace_id;
  private baseUrl = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${this.workspace_id}`;

  private context: AssistantV1.Context;

  constructor(private http: HttpClient) {
  }

  sendMessage(message: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + window.btoa(`apikey:`+environment.api_key)
    });

    const body = {
      input: {
        text: message
      },
      context: this.context
    };
    /*console.log('***************************');
    this.http.post('http://10.8.35.47:8080/hello', body, {headers:headers})
      .subscribe( data =>  {
        console.log(data);
      });
    console.log('****************************');*/
    const promise = new Promise<IExchange>((resolve, reject) => {
      this.http.post<MessageResponse>(
        `${this.baseUrl}/message?version=${this.version}`,
        body, {headers: headers}).toPromise()
        .then((messageResponse: MessageResponse) => {
          this.context = messageResponse.context;

          let intent: string = '';
          let response: string = 'Sorry I don\’t understand your question. ' +
            'Please try rephrasing. If you’re looking for \“how-to\” information, ' +
            'try visiting the job aids page <a href=\"http://fiscal.ca.gov/user-support/job-aids/\" target=\"_blank\">http://fiscal.ca.gov/user-support/job-aids/</a>.  ' +
            'You can also get help from a live agent in the FI$Cal Service Center. \n' +
            'Phone: (855) 347-2250\n' +
            'Email: fiscalservicecenter@fiscal.ca.gov\n' +
            'Monday through Friday\n' +
            '7:30 a.m. — 5:30 p.m., Pacific Time\n' +
            'ServiceNow is available 24 hours a day to report issues or make a request to the FSC.\n';
           console.log(JSON.stringify(messageResponse, null, 2));
          // If an intent was detected, log it out to the console.
          if (messageResponse.intents.length > 0) {
            console.log('Response: ' + messageResponse.intents.length);
            console.log('Detected intent: #' + messageResponse.intents[0].intent);

          }else{
            if(messageResponse.output.generic.length >= 2){
              console.log(messageResponse.output.generic[0].text+'\n'+messageResponse.output.generic[1].text);
            }
          }

          if (messageResponse.output.generic.length !== 0 &&  messageResponse.intents.length != 0) {
            console.log('Confidence: ' + messageResponse.intents[0].confidence);
            if(messageResponse.intents[0].confidence > 0.65){
              response = messageResponse.output.generic[0].text;
            }
            let exchange = {
              message: messageResponse.input.text,
              response: response,
              intent: intent,
              time: new Date()
            };
            resolve(exchange);
          } else {
            let emptyExchange = {
              message: messageResponse.input.text,
              response: response,
              intent: intent,
              time: new Date()
            };
            resolve(emptyExchange);
          }
        })
        .catch((error: any) => {
          console.log(error);
          reject(error);
        });
    });
    return promise;
  }

  createDialogNode(dialogeNodeName: string, responseText: string) {}
}
