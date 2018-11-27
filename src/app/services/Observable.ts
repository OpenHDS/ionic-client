export interface Observable {
  subscribe(topic, observer);
  unsubscribe(observer);
  publishChange(topic, data?);
}
