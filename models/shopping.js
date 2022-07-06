const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shoppingSchema = new Schema({
	name: String,
	date: String,
});

module.exports = mongoose.model('Shopping', shoppingSchema);
