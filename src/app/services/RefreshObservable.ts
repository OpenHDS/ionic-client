export class RefreshObservable {
  observers: any;

  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(subscribed => {
      subscribed !== observer;
    });
  }

  // Publish the changed data to the subscribed entity to refresh the entity
  publishChange(data) {
    this.observers.forEach(subscribed => {
      subscribed(data);
    });
  }
}
