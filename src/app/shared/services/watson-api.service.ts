import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as AssistantV1 from '../models/assistant/v1';
import {MessageResponse} from '../models/assistant/v1';

@Injectable()
export class WatsonAPIService {
    private username = '33d979c4-fadd-4dd3-929d-0e3e65737e3e';
    private password = 'r2JDBpg0TpwV';
    private version = '2018-09-20';
    private workspace_id = '91811fb6-6a47-4ada-bdb0-c7213e8aa1ed';
    private baseUrl = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${this.workspace_id}`;
    private context: AssistantV1.Context;

    constructor(private http: HttpClient) {
    }

    sendMessage(message: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + window.btoa(`${this.username}:${this.password}`)
        });

        const body = {
            input: {
                text: message
            },
            context: this.context
        };

        const promise = new Promise<string>((resolve, reject) => {
            this.http.post<MessageResponse>(
                `${this.baseUrl}/message?version=${this.version}`,
                body, { headers: headers }).toPromise()
                .then((response: MessageResponse) => {
                    this.context = response.context;

                    // If an intent was detected, log it out to the console.
                    if (response.intents.length > 0) {
                        console.log('Detected intent: #' + response.intents[0].intent);
                    }

                    if (response.output.generic.length !== 0) {
                        resolve(response.output.generic[0].text);
                    } else {
                        resolve('');
                    }
                })
                .catch((error: any) => {
                    console.log(error);
                    reject(error);
                });
        });
        return promise;
    }


  createDialogNode(responseText: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + window.btoa(`${this.username}:${this.password}`)
    });

    const body = {
      dialog_node: 'greeting',
      conditions: '#hello',
      output:
        {
          generic: [
            {
              response_type: 'text',
              values: [
                {
                  text: responseText
                }
              ]
            }
          ]
        },
      title: 'Greeting'

    };
    const promise = new Promise<string>((resolve, reject) => {
      this.http.post<MessageResponse>(
        `${this.baseUrl}/dialog_nodes?version=${this.version}`,
        body, { headers: headers }).toPromise()
        .then((response: MessageResponse) => {
          this.context = response.context;

         if (response.output.generic.length !== 0) {
           console.log(JSON.stringify(response, null, 2));
         } else {
            resolve('');
          }
        })
        .catch((error: any) => {
          console.log(error);
          reject(error);
        });
    });
    return promise;
  }
}
