var mongoose = require('mongoose');

const Schema = mongoose.Schema;

var emotionSchema = new Schema({
	//name: String,
	emotion: String,
	rate: {type: Number, min: 0, max: 100},
	message: String
});

module.exports = mongoose.model('Emotion', emotionSchema);