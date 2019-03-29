import Vector from './vector';

export default class Drone {

  public static droneCount = 1;

  id: number;
  batteryLevel :number;
  position :Vector;
  velocity :Vector;
  acceleration :Vector;
  state :boolean;

  constructor(position: Vector) {
    this.id = Drone.droneCount;
    this.batteryLevel = 100;
    this.position = position;
    this.velocity = new Vector(0,0,0);
    this.acceleration = new Vector(0,0,0);
    this.state = false;

    Drone.droneCount++;
  }

}