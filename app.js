require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require('./config/db.js'); //insert path to database here, add gitignore for that folder
const app = express();

const port = process.env.PORT || 8000;

app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

mongoose.connect(db.url, (err) => { //need to intialize db first
	if (err) throw err;
});

app.listen(port, () => {
	console.log('We are live on ' + port);
});