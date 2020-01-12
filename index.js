'use strict';

const express = require('express');
const dgram = require('dgram');
const fs = require('fs');

const UDP_PORT = 1356;
const HOST='192.168.0.100';

const message = Buffer.from('Updated!', 'utf8');
const client = dgram.createSocket('udp4');

client.on('message', (message, remote) => {
  console.log(`UDP message received from: ${remote.address}:${remote.port} -
  ${message}`);
});

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Welcome to SketchTunes!');
});

app.post('/api/v1/lines', (req, res) => {
  console.log('[alan] data: ');
  console.log(req.body);

  // console.log('sending udp packet now...');

  writeToFile(req.body.data);

  client.send(message, 0, message.length, UDP_PORT, HOST, (err, bytes) => {
    if (err) {
        console.error(`UDP message send error:`, err);
    } else {
        console.log(`UDP message sent to ${HOST}:${UDP_PORT}`);
    }
  });

  res.json({requestBody: req.body})
});

if (module === require.main) {
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

function writeToFile(array2D) {

  let stream = fs.createWriteStream("Demo.txt");

  stream.once('open', function(fd) {
    for (let i = 0; i < array2D.length; i++) {
      let dataString = '';

      if (array2D[i] !== -99999) {
        dataString += i + ", ";
        for (let j = 0; j < array2D[i].length; j++) {
          dataString += array2D[i][j] + ' ';
        }
        dataString += ";\n";
      } else {
        dataString += i + ", null;\n";
      }

      stream.write(dataString);
    }

    stream.end();
  });
}

module.exports = app;
