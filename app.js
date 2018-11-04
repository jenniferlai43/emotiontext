require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const multer  = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

require('./controllers/index.js')(app);

require('./controllers/socket.js')(io);

const port = 3000;

http.listen(port, () =>
{
	console.log('We are listening on port ' + port);
});