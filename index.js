'use strict';

const express = require('express');

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
  res.json({requestBody: req.body})
});

if (module === require.main) {
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}
module.exports = app;
