import { Observer } from "./Observer";
import { Flight } from "./entity/Flight";

export abstract class Subject {
  protected observers: Observer[] = [];

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  protected notifyObservers(flight: Flight): void {
    for (const observer of this.observers) {
      observer.update(flight);
    }
  }
}
