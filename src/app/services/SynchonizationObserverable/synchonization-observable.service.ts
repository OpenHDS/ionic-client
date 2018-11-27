import { Injectable } from '@angular/core';
import {Observable} from "../Observable";

@Injectable({
  providedIn: 'root'
})

//Synchronization Observable -- Handles and publishes changes made to lists of entities in the application. Used when
//new entities are created, or the database is synchronized.
export class SynchonizationObservableService implements Observable{
  observers: any;

  constructor() {
    this.observers = [];
  }

  subscribe(topic, observer) {
    this.observers.push({observer: observer, topic: topic});
    console.log(this.observers);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((subscribed) => {
      subscribed.observer !== observer;
    });
  }

  // Publish the changed data to the subscribed entity to refresh the entity
  publishChange(topic, data?) {
    console.log(this.observers);
    this.observers.forEach((subscribed) => {
      console.log(subscribed.topic);
      if(subscribed.topic === topic)
          subscribed.observer(data);
    });
  }
}
