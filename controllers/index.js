
var mongoose = require('mongoose');

var Emotion = require('../models/emotion.js');


module.exports = (app) => {
	//var upload = multer({ dest: '/uploads'});
	app.get('/', (req, res) => {
		res.render('index.ejs');
		//res.send("<h1>Hello World!</h1>");
	});

	/*
	app.post('/uploads', upload.single('pic') (req, res, next) =>{

	});
	*/

	//query through database, look for max emotion
	
	Emotion.create({emotion: "happiness", rate: 10, message: 'Hello!'}, (err, obj)=>{
		console.log('objinsertest:');
		console.log(obj);
	});

	app.post('/message', (req, res) => {
		//getting data from request
		var emotion = req.body.emotion;
		console.log('emotion: '+ emotion);
		Emotion.find({emotion: emotion}).limit(1).exec((err, obj)=>{
			if (err) throw err;
			else
			{
				console.log(obj);
				res.json(obj);
			}
		});
	});
	

}