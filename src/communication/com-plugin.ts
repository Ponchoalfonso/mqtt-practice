import Drone from '../utility/drone'; 
import { Client, connect } from 'mqtt';

export default class CommunicationPlugin {

  private client: Client;
  private dlist: any[];
  private _ready = false;

  constructor(droneList: any[]) {
    this.client = connect('mqtt://test.mosquitto.org');
    this.client.on('connect', () => {
      this._ready = true;
    });
    this.dlist = droneList;
    this.client.on('message', function (topic, message) {
      this.addDrone(
        { 
          ...JSON.parse(message.toString()),
          quadrant: CommunicationPlugin.topicToQuadrant(topic)
        }
      );
    });
  }

  /* Getters */
  public get ready() { return this._ready; }

  /* Static methods */
  public static quadrantToTopic(quadrant: number[]): string { return `map/qdrt-${quadrant[0]}-${quadrant[1]}`; }

  public static topicToQuadrant (topic: string): number[] {
    let start = topic.indexOf('qdrt-');
    if (start !== -1) {
      start += 5;
      let qd = topic.substr(start).split('-');
      return [+qd[0], +qd[1]];
    }
    else
      return [];
  }


  /* Instance methods */
  private addDrone(drone: any): void {
    for (let i = 0; i < this.dlist.length; i++) {
      if (this.dlist[i].id === drone.id) {
        this.dlist[i] = drone;
      } else {
        this.dlist.push(drone);
      }
    }
  }

  public end(): void { this.client.end(); }

  public publishDrone(drone: Drone, quadrant: number[]): void {
    if (quadrant.length === 2) {
      this.client.publish(
        CommunicationPlugin.quadrantToTopic(quadrant),
        Buffer.from(JSON.stringify(drone), 'utf8')
      );
    } else { console.warn(`DRN${drone.id}: Bad quadrant!`); }
  }

  public subscribe(quadrant: number[]): void {
    this.client.subscribe(CommunicationPlugin.quadrantToTopic(quadrant));
  }
}