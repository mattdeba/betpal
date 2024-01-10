/* eslint-disable */
const express = require('express');
const app = express();
const path = require('path');

app.use('/', express.static('./dist/betpal'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/betpal/browser/index.html'));
});

app.listen(8080, () => console.log('HTTP Server running on port 8080'));
