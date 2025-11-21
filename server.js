require('dotenv').config(); //environment variables
const mongoose = require('mongoose'); //connect to mongodb
const session = require('express-session');
const cors = require('cors'); //what origin to allow
const express = require('express'); //to create server
const helmet = require('helmet'); //protection
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
	windowMs: 1000*60*15,
	max: 100,
	message: "Too many request, please try again later."
});

const PORT = process.env.PORT;

const app = express();

app.use(session({
	secret: process.env.SECRETKEY,
	resave: false,
	saveUninitialized: true
}));

//allow any origin to request
app.use(cors());
app.use(helmet());
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

app.get('/', (req, res) => {
	res.send("Updated November 18");
});
app.use('/', require('./routes/storage'));
app.use('/', apiLimiter)

app.use('/auth', require('./routes/auth'));
app.use('/auth', apiLimiter);
app.use('/user', require('./routes/user'));
app.use('/user', apiLimiter);


//Connecting to Database
const mongoDBUri = process.env.MONGO_URI;
mongoose.connect(mongoDBUri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => {
		console.log('Mongodb database configured successfully.');
	})
	.catch(err => {
		console.error('Failed to connect to MongoDB', err)
	});
const db = mongoose.connection;
db.on('connected', () => { console.log('Connected to database MongoDB.'); });
db.on('error', err => console.error('Mongoose connection error:', err));
db.on('disconnected', () => { });


app.listen(PORT, '0.0.0.0', () => {
	console.log(`Server listening at port ${PORT}`)
});

//When the user press ctrl C
process.on('SIGINT', () => {
	async function closeConnection() {
		try {
			await mongoose.connection.close();
			console.log('Connection closed successfully.');
			process.exit(0);
		} catch (err) {
			console.error('Failed to close the connection:', err);
		}
	}
	// Call the function when you need to close the connection
	closeConnection();
});
