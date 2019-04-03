import { connect } from 'mqtt';
import Drone from './utility/drone';
import Vector from './utility/vector';

const client = connect('mqtt://test.mosquitto.org');
let myDrone = new Drone(new Vector(30, 0, 30));

client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hi!!');
    }
  });
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
});

