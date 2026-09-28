import { FlightFeed } from "./FlightFeed";
import { FlightStatusObserver } from "./FlightStatusObserver";
import { FlightDeltaObserver } from "./FlightDeltaObserver";

main();

function main() {
  let feed = new FlightFeed();

  feed.addObserver(new FlightStatusObserver());
  feed.addObserver(new FlightDeltaObserver());

  feed.start();
}
