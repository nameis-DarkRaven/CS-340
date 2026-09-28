import { Observer } from "./Observer";
import { Flight } from "./entity/Flight";

export class FlightStatusObserver implements Observer {
  update(flight: Flight): void {
    console.log("Flight Status Update");
    console.log(`ICAO24: ${flight.icao24}`);
    console.log(`Callsign: ${flight.callsign}`);
    console.log(`Country: ${flight.origin_country}`);
    console.log(`Longitude: ${flight.longitude}`);
    console.log(`Latitude: ${flight.latitude}`);
    console.log(`Velocity: ${flight.velocity}`);
    console.log(`Altitude: ${flight.geo_altitude}`);
    console.log("-----------------------------");
  }
}
