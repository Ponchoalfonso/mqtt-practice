export default class Vector {

  public x: number;
  public y: number;
  public z: number;

  constructor (x: number, y: number, z: number = null) {
    this.x = x;
    this.y = y;
    this.z = z || 0;
  }

  /* Getters */
  public get magnitude(): number {
    return Math.sqrt(this.squareMagnitude());
  }

  public squareMagnitude(): number {
    return (this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /* Static methods */
  public static distance(vA: Vector, vB: Vector) {
    return Math.pow(Math.pow(vB.x - vA.x, 2) + Math.pow(vB.y - vA.y, 2) + Math.pow(vB.y - vA.y, 2), 1/2);
  }

  public static equals(v1: Vector, v2: Vector): boolean {
    return (v1.x === v2.x && v1.y === v2.y && v1.z === v2.z);
  }

  /* Instance methods */
  public add(vector: Vector): void {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
  }

  public copy(): Vector {
    return new Vector(this.x, this.y, );
  }

  public distance(vB: Vector): number {
    return Math.pow(Math.pow(vB.x - this.x, 2) + Math.pow(vB.y - this.y, 2) + Math.pow(vB.y - this.y, 2), 1/2);
  }

  public divide(vector: Vector): void {
    this.x /= vector.x;
    this.y /= vector.y;
    this.z /= vector.z;
  }

  public equals(vector: Vector): boolean {
    return (this.x === vector.x && this.y === vector.y && this.z === vector.z);
  }

  public multiply(number: number): void;
  public multiply(vector: Vector): void;
  public multiply(val: any): void {
    if (val instanceof Vector) {
      this.x *= val.x;
      this.y *= val.y;
      this.z *= val.z;
    } else if (typeof(val) === 'number') {
      this.x *= val;
      this.y *= val;
      this.z *= val;
    }
  }

  public substract(vector: Vector): void {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
  }
}
