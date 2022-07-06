const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Shopping = require('./models/shopping');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/tes-bts', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
	console.log('database connected');
});

const app = express();

const port = 3000;

// configuring the rendered file path using path modules
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// set the ejsMate
app.engine('ejs', ejsMate);

app.use(passport.initialize());
passport.use(new localStrategy(User.authenticate()));

// use the express parser to parse the post request in the body
app.use(express.urlencoded({ extended: true }));
// use the method override
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/shopping', async (req, res) => {
	const shopping = await Shopping.find({});
	res.render('shopping/shopping', { shopping });
});

app.get('/shopping/new', (req, res) => {
	res.render('shopping/new');
});

app.post('/shopping', async (req, res) => {
	const shopping = new Shopping(req.body.shopping);
	await shopping.save();
	res.redirect(`/shopping/${shopping._id}`);
});

app.get('/shopping/:id', async (req, res) => {
	const shopping = await Shopping.findById(req.params.id);
	res.render('shopping/showShop', { shopping });
});

app.get('/shopping/:id/edit', async (req, res) => {
	const shopping = await Shopping.findById(req.params.id);
	res.render('shopping/edit', { shopping });
});

app.put('/shopping/:id', async (req, res) => {
	const { id } = req.params;
	const shopping = await Shopping.findByIdAndUpdate(id, { ...req.body.shopping });
	res.redirect(`/shopping/${shopping._id}`);
});

app.delete('/shopping/:id', async (req, res) => {
	const { id } = req.params;
	await Shopping.findByIdAndDelete(id);
	res.redirect('/shopping');
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
