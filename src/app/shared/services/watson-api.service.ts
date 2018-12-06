import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as AssistantV1 from '../models/assistant/v1';
import {MessageResponse} from '../models/assistant/v1';
import {IExchange} from "../models/watson-models";
import {Observable, Subject} from "rxjs";
import {consoleTestResultHandler} from "tslint/lib/test";
import {Config} from "protractor";

@Injectable()
export class WatsonAPIService {
    private username = '33d979c4-fadd-4dd3-929d-0e3e65737e3e';
    private password = 'r2JDBpg0TpwV';
    private version = '2018-09-20';
    //private workspace_id = '91811fb6-6a47-4ada-bdb0-c7213e8aa1ed';
    //private baseUrl = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${this.workspace_id}`;


  private workspace_id = 'b157af29-6936-4504-8eb4-ca5cd7234509';
  private baseUrl = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${this.workspace_id}`;


  /*
    private version = '2018-09-20';
    private workspace_id = 'b157af29-6936-4504-8eb4-ca5cd7234509';
    private baseUrl = `https://gateway.watsonplatform.net/assistant/api/v1/workspaces/${this.workspace_id}`;
    FI$cal IBM Watson details

    https://gateway.watsonplatform.net/assistant/api
    apikey:Ag8N1MxqwmzzqOiQudpa6coWv7QsCrMAvPgE5eFnP2x4
    workspaceid:b157af29-6936-4504-8eb4-ca5cd7234509
  */



    private context: AssistantV1.Context;

    constructor(private http: HttpClient) {
    }

    sendMessage(message: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + window.btoa(`apikey:Ag8N1MxqwmzzqOiQudpa6coWv7QsCrMAvPgE5eFnP2x4`)
        });

        const body = {
            input: {
                text: message
            },
            context: this.context
        };

        const promise = new Promise<IExchange>((resolve, reject) => {
            this.http.post<MessageResponse>(
                `${this.baseUrl}/message?version=${this.version}`,
                body, { headers: headers }).toPromise()
                .then((response: MessageResponse) => {
                    this.context = response.context;

                    let intent: string = '';
                    // If an intent was detected, log it out to the console.
                    if (response.intents.length > 0) {
                        console.log('Detected intent: #' + response.intents[0].intent);
                        intent = response.intents[0].intent;
                       }

                    if (response.output.generic.length !== 0) {
                      let exchange = {
                        message: response.input.text,
                        response: response.output.generic[0].text,
                        intent: intent,
                        time: new Date()
                      };
                        resolve(exchange);
                    } else {
                      let emptyExchange = {
                        message: response.input.text,
                        response: '',
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

  getTasks() {
    return this.http.get('/hello');
  }

  createDialogNode(dialogeNodeName: string, responseText: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + window.btoa(`apikey:Ag8N1MxqwmzzqOiQudpa6coWv7QsCrMAvPgE5eFnP2x4`)
    });

    const body = {
      dialog_node: dialogeNodeName,
      conditions: '#'+dialogeNodeName,
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
      title: dialogeNodeName

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

  /*deleteDialog(dialogeNodeName: string) {

    let responseText : string = '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + window.btoa(`apikey:Ag8N1MxqwmzzqOiQudpa6coWv7QsCrMAvPgE5eFnP2x4`)
    });

    const body = {
      dialog_node: dialogeNodeName,
      conditions: '#'+dialogeNodeName,
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
      title: dialogeNodeName

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
  }*/
}
