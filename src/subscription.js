export class Subscription {
  constructor(initialEvent) {
    this.subs = [];
    this.lastEvent = initialEvent;
    this.initialEvent = initialEvent;

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.notify = this.notify.bind(this);
    this.value = this.value.bind(this);
    this.initialValue = this.initialValue.bind(this);
  }

  add(newSub) {
    this.subs = [...this.subs, newSub];
  }

  remove(subToRemove) {
    this.subs = this.subs.filter((sub) => sub !== subToRemove);
  }

  notify(event) {
    this.subs.forEach((sub) => sub(event));
    this.lastEvent = event;
  }

  value() {
    return this.lastEvent;
  }

  initialValue() {
    return this.initialEvent;
  }
}
