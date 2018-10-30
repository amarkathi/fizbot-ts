import { Injectable } from '@angular/core';
import {Observable, ObservableInput, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CorpusService {

  private subject = new Subject<any>();

  sendCorpus(message: string){
    this.subject.next({text: message});
  }

  clearCorpus() {
    this.subject.next();
  }

  getCorpus(): Observable<any> {
    return this.subject.asObservable();
  }
}
