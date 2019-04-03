import { connect } from 'mqtt';

const client = connect('mqtt://test.mosquitto.org');

client.on('connect', function () {
  client.subscribe('poncho/map/+', (err) => { 
    if (!err) {
      console.log("Subscribed to map Spy!")
    }
  });
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic + message.toString());
});

