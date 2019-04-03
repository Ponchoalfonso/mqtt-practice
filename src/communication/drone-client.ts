import Drone from '../utility/drone';
import { Map } from '../utility/map';
import DroneAI from '../flight-control/drone-ai';

export default class DroneClient {

  public drone: Drone;
  public droneai: DroneAI;

  constructor(drone: Drone, map: Map) {
    this.droneai = new DroneAI(drone, map);
  }

  public start(): void {
    this.setUp();
    setInterval(() => {this.loop()}, 500);
  }

  private setUp(): void {
    this.droneai.startTrip();
  }

  private loop(): void {
    this.droneai.followRoute();
  }
}