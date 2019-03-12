const five = require('johnny-five');
const moment = require('moment-timezone');
const iot = require('aws-iot-device-sdk');
const fs = require('fs');
const path = require('path');

const AWS = require('aws-sdk');

// AWS IoT Device configuration
const device = iot.device({
  keyPath: __dirname + '/keys/private.pem.key', 
  certPath: __dirname + '/keys/certificate.pem.crt', 
  caPath: __dirname + '/keys/root-CA.pem.crt',
  clientId: process.env.AWS_IOT_CLIENTID || 'SA-DEMO',
  region: process.env.AWS_REGION || 'us-east-1',
  host: process.env.HOST || 'a2gbxtr4w5orf3-ats.iot.us-east-1.amazonaws.com',
});

const board = new five.Board();

board.on('ready', () => {
  var servo = new five.Servo(10);
  device.subscribe('topic1', JSON.stringify({message: 'subscribed'}));
  
  device
  .on('message', function(topic, payload) {
    var j = JSON.parse(payload.toString());
    servo.to(j.degree);
  });
});

device.on('connect', () => {
  console.log('Connecting to Amazon IoT');
});

device.on('message', (topic, payload) => {
  console.log('Your messaged was received by Amazon IoT:', topic, payload.toString());
});

device.on('close', () => {
  // do nothing
});

device.on('reconnect', () => {
  console.log('Attempting to reconnect to Amazon IoT');
});

device.on('error', err => {
  console.log(`Error: ${err.code} while connecting to ${err.hostname}`);
});

device.on('offline', () => {
  // do nothing
});