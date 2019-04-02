import Vector from './vector';

export default class Drone {

  public static droneCount = 1;

  public id: number;
  public batteryLevel: number;
  public position: Vector;
  public velocity: Vector;
  public state: boolean;

  private stopSequence: Vector[];
  private trip: number; // The number of trips made by the drone

  constructor(position: Vector) {
    this.id = Drone.droneCount;
    this.batteryLevel = 100;
    this.position = position;
    this.velocity = new Vector(0,0,0);
    this.state = false;
    this.stopSequence = [];
    this.trip = 0;

    Drone.droneCount++;
  }

  /* Getters */
  public get nextStop(): Vector {
    return this.getStopAtTtrip(this.trip);
  }

  /* Instance methods */
  public accelerate(direction: Vector) {
    if (this.state)
      this.velocity.add(direction);
  }

  public addStopToSequence(stopPoint :Vector): void {
    this.stopSequence.push(stopPoint);
  }

  public nextTrip(): void { this.trip++ }

  public smallRestruct(): any {
    return {
      id: this.id,
      position: {
        x: this.position.x,
        y: this.position.y,
        z: this.position.z
      },
      velocity: {
        x: this.velocity.x,
        y: this.velocity.y,
        z: this.velocity.z
      },
      headingTo: {
        x: this.nextStop.x,
        y: this.nextStop.y,
        z: this.nextStop.z
      }
    }
  }

  public getStopAtTtrip(trip: number): Vector {
    return this.stopSequence[(trip - 1) % this.stopSequence.length];
  }

  public move(): void {
    if (this.state)
      this.position.add(this.velocity);
  }

}