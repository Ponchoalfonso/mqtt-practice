import Vector from './vector';

export interface Place {
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
    let x;
    if (val instanceof Vector) {
      x = val.x;
      z = val.z;
    } else if (typeof(val) === 'number' && z) {
      x = val;
    }

    if (x > this.width || z > this.length)
      return [];
    else {
      [Math.ceil(x / this.quadrantSize) - 1, Math.ceil(z / this.quadrantSize) - 1]
    }
  }

  public placeExists(p: Place): boolean {
    let exists = true;
    for (const place of this.places) {
      exists = (exists && (Map.equalPlaces(place, p)));
    }

    return exists;
  }
}