import Vector from './utility/vector';
import Drone from './utility/drone';
import { Map, Place } from './utility/map';

const myMap = new Map(2000, 1000, 20);
const myPlaces = [
  { name: "A", location: new Vector(70,   0, 400 ) },
  { name: "B", location: new Vector(988,  0, 577 ) },
  { name: "C", location: new Vector(118,  0, 72  ) },
  { name: "D", location: new Vector(1436, 0, 999) },
  { name: "E", location: new Vector(1720, 0, 928 ) },
  { name: "F", location: new Vector(1901, 0, 662 ) },
  { name: "G", location: new Vector(1051, 0, 305 ) },
  { name: "H", location: new Vector(151,  0, 898 ) },
  { name: "I", location: new Vector(626,  0, 891 ) }
];
const myDrones = [
  new Drone(new Vector(70, 0, 400)),
];

const stops = [
  [5, 4, 1, 7],
];

const addPlacesToMap = (map: Map, places: Place[]) => {
  for (const place of places) {
    map.addPlace(place);
  }
}

const addRouteToDrone = (drone: Drone, placeIndexes: number[], map: Map) => {
  for (const index of placeIndexes) {
    drone.addStopToSequence(map.getPlace(index).location);
  }
}

export const init = (index: number) => {
  addPlacesToMap(myMap, myPlaces);
  for (let i = 0; i < myDrones.length; i++) {
    addRouteToDrone(myDrones[i], stops[i], myMap);
  }

  return { drone: myDrones[index], map: myMap };
}