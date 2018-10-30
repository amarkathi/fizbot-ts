import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AssistantV1} from "watson-developer-cloud";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getRandomPost(userId){
    console.log('https://jsonplaceholder.typicode.com/posts/'+userId);

    /*var watsonAssistant = new AssistantV1({
      version: '2018-09-20',
      username: '33d979c4-fadd-4dd3-929d-0e3e65737e3e',
      password: 'r2JDBpg0TpwV',
      url: 'https://gateway.watsonplatform.net/assistant/api'
    });*/
    //this is it
    /* not getting compiled
        var watsonAssistant = new AssistantV1({
          version: '2018-09-20',
          username: '33d979c4-fadd-4dd3-929d-0e3e65737e3e',
          password: 'r2JDBpg0TpwV',
          url: 'https://gateway.watsonplatform.net/assistant/api'
        });

        watsonAssistant.message({
          workspace_id: '9978a49e-ea89-4493-b33d-82298d3db20d',
          input: {'text': 'Hello'}
        },  function(err, response) {
          if (err)
            console.log('error:', err);
          else
            console.log(JSON.stringify(response, null, 2));
        });*/

  // end of the authentication
    return this.http.get('https://jsonplaceholder.typicode.com/posts/'+userId);
  }
}
