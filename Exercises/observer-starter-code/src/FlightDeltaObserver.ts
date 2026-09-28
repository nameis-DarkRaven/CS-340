import { Observer } from "./Observer";
import { Flight } from "./entity/Flight";

export class FlightDeltaObserver implements Observer {
  private previous: Flight | null = null;

  update(flight: Flight): void {
    if (this.previous) {
      console.log("Flight Delta Update");
      console.log(`Longitude: ${flight.longitude - this.previous.longitude}`);
      console.log(`Latitude: ${flight.latitude - this.previous.latitude}`);
      console.log(`Velocity: ${flight.velocity - this.previous.velocity}`);
      console.log(
        `Altitude: ${flight.geo_altitude - this.previous.geo_altitude}`,
      );
      console.log("-----------------------------");
    }

    this.previous = flight;
  }
}
