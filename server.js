const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');

const app = express();

const pubPath = __dirname + '/public/';
const port = 3000;

const con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test'
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.static(pubPath));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', (req, res) => {
	res.sendFile(pubPath + 'index.html');
});

app.get('/login', (req, res) => {
	res.sendFile(pubPath + 'login.html');
});

app.get('/register', (req, res) => {
	res.sendFile(pubPath + 'register.html');
});
app.post('/api/reg', (req, res) => {
	let email = req.body.email;
	let username = req.body.username;
	let password = req.body.password;
	let password2 = req.body.password2;

	if (email && username && password === password2) {
		if (con.query('SELECT * FROM users WHERE username = ?', [username], (err, results, fields) => {
				if (results.length > 0) res.send('This username is already taken!');
				else {
					con.query('INSERT INTO users (email, username, password) values (?, ?, ?)', [email, username, password], (error) => {
						if (error)
							throw error;
					});
					req.session.loggedin = true;
					req.session.username = username;
					res.redirect('/')
				}
			}));
	} else res.send('Wrong information input!');
});
app.post('/api/auth', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results, fields) => {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/')
			} else res.send('Wrong username and/or password!');
		})
	}
});


app.listen(port, () => {
	console.log('Example app listening on port ' + port + '!');
});
