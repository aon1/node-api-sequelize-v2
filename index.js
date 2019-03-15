const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const router = require('./app/router/');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', router);

app.listen(3000, () => {
    console.log('Node server listening on port 3000');
});