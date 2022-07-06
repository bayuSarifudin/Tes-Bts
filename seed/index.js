// dont run it after you are in production, it will delete everything

// require mongoose, model shema, and the file that needed
const mongoose = require('mongoose');
const Shopping = require('../models/shopping');
const shopSeed = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/tes-bts', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
	console.log('database connected');
});

const seedDB = async () => {
	// code to get the database filled with data starter
	await Shopping.deleteMany({}); //delete everything first
	for (let i = 1; i <= 3; i++) {
		const random = Math.floor(Math.random() * 3);
		const newShopping = new Shopping({
			name: shopSeed[random].name,
			date: shopSeed[random].date,
		});
		await newShopping.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close(); //help to close the connection after run the mongoose connection
});
