import { Injectable } from '@angular/core';
import {Context, MessageResponse} from '../models/assistant/v1';
import {WatsonAction} from '../models/watson-actions';

@Injectable()
export class WatsonDataService {
    private username = '4bc0b3ee-b452-46ab-abcd-88c1a03c815d';
    private password = 'aVUjOeIlP215';
    private version = '2018-07-10';
    private workspace_id = 'edfff9b0-747b-4243-b710-79d8cc08bcf1';
    private context: Context;
   /* private assistant = new AssistantV1({
        username: this.username,
        password: this.password,
        version: this.version
    });*/

    sendMessage(message: string): Promise<{message?: string, action?: WatsonAction}> {
        const promise = new Promise<{message?: string, action?: WatsonAction}>((resolve, reject) => {
           /* this.assistant.message({
                workspace_id: this.workspace_id,
                context: this.context,
                input: { text: message }
            }, (error, response) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                this.context = response.context;
                // If an intent was detected, log it out to the console.
                if (response.intents.length > 0) {
                    console.log('Detected intent: #' + response.intents[0].intent);
                }
                const action = this.takeAction(response);
                if (response.output.generic.length !== 0) {
                    resolve({ message: response.output.generic[0].text, action: action });
                }
            });*/
        });
        return promise;
    }

    private takeAction(response: MessageResponse): WatsonAction {
        if (response.actions) {
            if (response.actions[0].action_type === 'client') {
                if (response.actions[0].name === 'display_time') {
                    return 'display_time';
                } else if (response.actions[0].name === 'end_conversation') {
                    // User said goodbye, so we're done.
                    return 'end_conversation';
                }
            }
        }
        return null;
    }
}
