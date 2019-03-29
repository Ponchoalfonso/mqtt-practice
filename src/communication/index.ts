import { connect } from 'mqtt';
import Drone from '../classes/drone';
import Vector from '../classes/vector';

const client = connect('mqtt://test.mosquitto.org');
let myDrone = new Drone(new Vector(30, 0, 30));

client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', Buffer.from(JSON.stringify(myDrone), 'utf8'));
    }
  });
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.end();
});

