const express = require('express');
const bodyparser = require('body-parser');

const app = express();

const pubPath = __dirname + '/public/';
const port = 3000;

app.use(express.static(pubPath));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(pubPath + 'index.html');
});

app.listen(port, () => {
  console.log('Example app listening on port ' + port + '!');
});
