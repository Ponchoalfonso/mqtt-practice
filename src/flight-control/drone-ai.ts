import Drone from '../utility/drone';
import { Map, Place } from '../utility/map';
import CommunicationPlugin from '../communication/com-plugin';

export class DroneAI {

  private complug: CommunicationPlugin;
  private drone: Drone;
  private drones: any[];
  private map: Map;
  
  constructor (drone: Drone, map: Map) {
    this.drone = drone;
    this.drones = [];
    this.complug = new CommunicationPlugin(this.drones);
    this.map = map;
  }

  public startTrip() {
    this.drone.state = true;
    this.drone.nextTrip();
  }
}