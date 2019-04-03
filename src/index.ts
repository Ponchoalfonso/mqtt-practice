import DroneClient from './communication/drone-client';
import { init } from './mock-data';

const enviroment = init(0);

const client = new DroneClient(enviroment.drone, enviroment.map);
client.start();