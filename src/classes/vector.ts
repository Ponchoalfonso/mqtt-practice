export default class Vector {

  public x :number;
  public y :number;
  public z :number;

  constructor (x :number, y :number, z :number = null) {
    this.x = x;
    this.y = y;
    this.z = z || 0;
  }

  public multiplyNumber(val :number) :void {
    this.x *= val;
    this.y *= val;
    this.z *= val;
  }

  public multiplyVector(vector :Vector) :void {
    this.x *= vector.x;
    this.y *= vector.y;
    this. z*= vector.z;
  }

}
