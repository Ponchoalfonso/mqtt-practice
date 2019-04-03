import Vector from './vector';
import { isArray } from 'util';

export type Place = {
  name: string;
  location: Vector;
}

export class Map {
  // The ground is on y = 0;
  public readonly length: number;
  public readonly width: number;
  public readonly quadrantSize: number;
  public readonly places: Place[];

  constructor(width: number, length: number, quadrantSize: number) {
    this.width = width;
    this.length = length;
    this.quadrantSize = quadrantSize;
    this.places = [];
  }

  /* Static methods */
  public static equalPlaces(p1: Place, p2: Place): boolean {
    return (Vector.equals(p1.location, p2.location) && p1.name === p2.name);
  }

  /* Instance methods */
  public addPlace(place: Place) {
    if (!this.placeExists(place))
      this.places.push(place);
  }

  public getPlace(index: number) { return this.places[index]; }

  public getQuadrant(position: Vector): number[];
  public getQuadrant(x: number, z: number): number[];
  public getQuadrant(val: any, z: number = null): number[] {
    let x: number;
    if (val instanceof Vector) {
      x = val.x;
      z = val.z;
    } else if (typeof(val) === 'number' && !isNaN(z))
      x = val;

    if (x >= this.width || z >= this.length || x < 0 || z < 0)
      return [];
    else
      return [Math.floor(x / this.quadrantSize), Math.floor(z / this.quadrantSize)];
  }

  public getQuadrantIndex(position: Vector);
  public getQuadrantIndex(quadrant: number[]);
  public getQuadrantIndex(val: any): number {
    let quadrant: any;
    if (val instanceof Vector)
      quadrant = this.getQuadrant(val);
    else if (isArray(val))
      quadrant = val;

    if (quadrant.length === 2 && quadrant)
      return quadrant[0] + quadrant[1] * Math.floor(this.width / this.quadrantSize);
    else
      return -1;
  }

  public placeExists(p: Place): boolean {
    let exists = true;
    for (const place of this.places) {
      exists = (exists && (Map.equalPlaces(place, p)));
    }

    if (this.places.length === 0)
      return false;

    return exists;
  }
}