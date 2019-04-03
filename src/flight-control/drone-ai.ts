import Drone from '../utility/drone';
import { Map, Place } from '../utility/map';
import CommunicationPlugin from '../communication/com-plugin';
import Vector from '../utility/vector';

export default class DroneAI {

  private complug: CommunicationPlugin;
  private drone: Drone;
  private drones: any[];
  private map: Map;
  private bheightLimit: number; // base heightlimit

  public heightLimit: number;
  public speedLimit: number;
  
  constructor (drone: Drone, map: Map, heightLimit = 20, speedLimit = 5) {
    this.drone = drone;
    this.drones = [];
    this.complug = new CommunicationPlugin(this.drones);
    this.map = map;
    this.bheightLimit = heightLimit;
    this.heightLimit = heightLimit;
    this.speedLimit = 5;
  }

  /* Getters */

  /*
   * Directons:
   * (+x +z), (+x -z), (-x +z), (-x -z),
   * (+x 0),(-x 0), (0 +y), (0 -y) 
   */
  private get droneDirection(): number[] {
    // Drone velocity snapshot
    let dv = this.drone.velocity.copy();
    dv.normalize();
    if (dv.x > 0 && dv.z > 0)
      return [1, 1];
    else if (dv.x > 0 && dv.z < 0)
      return [1, -1];
    else if (dv.x < 0 && dv.z > 0)
      return [-1, 1];
    else if (dv.x < 0 && dv.z < 0)
      return [-1, -1];
    else if (dv.x > 0 && dv.z === 0)
      return [1, 0];
    else if (dv.x < 0 && dv.z === 0)
      return [-1, 0];
    else if (dv.x === 0 && dv.z > 0)
      return [0, 1];
    else if (dv.x === 0 && dv.z < 0)
      return [0, -1];
    else
      return [0, 0];
  }

  private get inAir(): boolean { return (this.drone.position.y !== 0); }

  private get nextQuadrant(): number[] {
    const dq = this.map.getQuadrant(this.drone.position); //drone current quadrant
    const dd = this.droneDirection; // drone direction
    const d = [];

    // Getting distance between the drone and the quadrant which it is heading on the x axis
    if (dd[0] > 0) {// if heading to +x
      const qpedp = this.drone.position.copy(); // quadrant parallel edge point to drone position
      qpedp.x = (dq[0] + dd[0]) * this.map.quadrantSize; // x quadrant edge
      d[0] = this.drone.position.distance(qpedp);
    } else if (dd[0] < 1) {// if heading to -x
      const qpedp = this.drone.position.copy(); // quadrant parallel edge point to drone position
      qpedp.x = (dq[0] + dd[0]) * this.map.quadrantSize + this.map.quadrantSize - 1; // x quadrant edge
      d[0] = this.drone.position.distance(qpedp);
    } else // if x equals 0
      d[0] = 0;

    // Getting distance between the drone and the quadrant which it is heading on the z axis
    if (dd[1] > 0) { // if heading to +z
      const qpedp = this.drone.position.copy(); // quadrant parallel edge point to drone position
      qpedp.z = (dq[1] + dd[1]) * this.map.quadrantSize; // x quadrant edge
      d[1] = this.drone.position.distance(qpedp);
    } else if (dd[1] < 1) { // if heading to -z
      const qpedp = this.drone.position.copy(); // quadrant parallel edge point to drone position
      qpedp.z = (dq[1] + dd[1]) * this.map.quadrantSize + this.map.quadrantSize - 1; // x quadrant edge
      d[1] = this.drone.position.distance(qpedp);
    } else // if z equals 0
      d[1] = 0;
    
    // Comparing which quadrant is going to be reached first
    if (d[0] / this.drone.velocity.x > d[1] / this.drone.velocity.z) // quadrant on the x axis
      return [dq[0] + dd[0], dq[1]];
    else if (d[0] / this.drone.velocity.x < d[1] / this.drone.velocity.z) // quadrant on the z axis
      return [dq[0], dq[1] + dd[1]];
    else // diagonally aligned quadrant
      return [dq[0] + dd[0], dq[1] + dq[1]];
  }

  private get onFloor(): boolean { return (this.drone.position.y === 0); }

  private get onHeightLimit(): boolean { return (this.heightLimit === this.drone.position.y); }

  private get onStop(): boolean {
    return (this.map.getQuadrantIndex(this.drone.position) === this.map.getQuadrantIndex(this.drone.nextStop));
  }

  /* Instance methods */
  private communicate(): void {
    this.dropDrones();
    this.complug.publish(this.drone, this.map.getQuadrant(this.drone.position));
    this.complug.publish(this.drone, this.nextQuadrant);
    this.complug.subscribe(this.map.getQuadrant(this.drone.position));
    this.complug.subscribe(this.nextQuadrant);
  }

  public descend(): void {
    this.fixHeight();
    if (this.drone.velocity.y >= 0)
      this.drone.accelerate(new Vector(0, -this.bheightLimit / 10, 0));
  }

  private dropDrones(): void {
    for (let i = 0; i < this.drones.length; i++) {
      const drone = this.drones[i];
      const q = this.map.getQuadrantIndex(drone.position);
      const cq = this.map.getQuadrantIndex(this.drone.position);
      const nq = this.map.getQuadrantIndex(this.nextQuadrant);

      if (q !== cq && q !== nq){
        this.complug.unsubscribe(CommunicationPlugin.topicToQuadrant(drone.quadrant));
        this.drones.splice(i, 1);
        i--;
      }
    }
  }

  public elevate(): void {
    this.fixHeight();
    if (this.drone.velocity.y <= 0)
      this.drone.accelerate(new Vector(0, this.bheightLimit / 10, 0));
  }

  private evade(): void {
    for (const drone of this.drones) {
      
    }
  }

  private fixHeight() {
    this.drone.position.y = Math.floor(this.drone.position.y);
  }

  // Main control
  public followRoute(): void {
    if (this.drone.state) {
      this.communicate();
      if (this.onStop && this.inAir)
        this.descend();
      else if (this.onStop && this.onFloor) {
        this.stay();
        this.drone.state = false;
      } else if(!this.onStop && this.onFloor && !this.onHeightLimit) {
        this.stay();
        this.elevate();
      }
      else if(!this.onStop && this.inAir)
        this.headTo(this.drone.nextStop);
    } else
      this.startTrip();
    this.drone.move();
  }

  public headTo(position: Vector) {
    if (this.droneDirection[0] === 0 && this.droneDirection[1] === 0) {
      this.keepHeight();
      const acceleration = this.drone.position.copy();
      const posSnap = position.copy(); // position snapshot
      posSnap.y = this.drone.position.y;
      acceleration.substract(posSnap);
      acceleration.normalize();
      acceleration.multiply(this.speedLimit);
      this.drone.accelerate(acceleration);
    }
  }

  public keepHeight(): void { this.drone.velocity.y = 0; }

  public startTrip(): void {
    this.drone.state = true;
    this.stay();
    this.drone.nextTrip();
  }

  public stay(): void { this.drone.velocity.multiply(0); }
}