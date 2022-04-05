// app.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./database/db.js');
const bodyParser = require('body-parser');
 
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req,res) => {
	res.redirect('/login');
});

app.get('/login', (req, res) => {
	res.render('login', { title: 'Login'});
});

// set a username for the welcome and datadase insertion:
let user = '';
let timeStamp ='';

function startTime() {
    var today = new Date();
    var mo = today.getMonth() + 1;
    var d = today.getDay();
    var y = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    mo = checkTime(mo);
    d = checkTime(d);
    m = checkTime(m);
    h = checkTime(h);
    s = checkTime(s);
    var t = setTimeout(startTime, 500);
    return  `${mo}/${d}/${y} - ${h}:${m}:${s}`;
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};
    return i;
}
startTime();
// console.log(startTime());

app.get('/login-info', (req, res) => {
	db.get("SELECT username, password FROM Users WHERE username = $name AND password = $password", {$name: req.query.username, $password: req.query.password}, (err, row) => {
		if(row) {
			user = row.username;
			let verses = 'beginning verses';
			db.all("SELECT * FROM Verses;", (err, rows) => {
				// console.log("rows: ", rows);
				verses = rows;
				// console.log('verses in the login: ', verses);
				res.render('index', {title: 'Home', user, verses});
			});	
		}else {
			res.render('user-password-err', {title: 'Error loging in'} );
		}
	});
});

// userExists - checks to see if user already exists or password doesnt match for the create account:
const userExists = (req, res, next) => {
	// console.log('inside userExists middleware.');
	db.get("SELECT * from Users WHERE username = $name;", {$name: req.body.username}, (err, row) => {
		if(row) {
			// console.log('checked to see if username already exists...');
			res.render('user-exists', {title: 'Try again', });
		}else if(req.body.password !== req.body.password2) {
			res.send('passwords do not match. try again.');	
	 	}else {
			next();	
	 	}
	});	
}

app.post('/create-account', userExists, (req, res) => {
	db.run("INSERT INTO Users(username, password) VALUES($name, $passwd);", {$name: req.body.username, $passwd: req.body.password}, (err) => {
		if(err) {
			throw err;
		}else {
			user = req.body.username;
			let verses = 'beginning verses';
			db.all("SELECT * FROM Verses;", (err, rows) => {
				// console.log("rows: ", rows);
				verses = rows;
				// console.log('verses in the login: ', verses);
				res.render('index', {title: 'Home', user, verses});
			});	
		}	
	});	
});

// // so I can check out the Users table:
// db.all("SELECT * FROM verses;", (err, rows) => {
// 	console.log(rows);
// });
// db.run("DELETE FROM Users WHERE username = 'test';", (err) => {
// 	if(err) {
// 		throw err;
// 	}
// })
// -------------

app.get('/home', (req, res) => {
	let verses;
	db.all("SELECT * FROM Verses;", (err, rows) => {
		verses = rows;
		res.render('index',  { title: 'Home', user, verses });
	});
});

app.get('/messages', (req, res) => {
	let messages;
	db.all("SELECT * FROM Messages;", (err, rows) => {
		messages = rows;
		res.render('messages',  { title: 'Messages', user, messages });
	});
});

app.get('/prayers', (req,res) => {
	res.render('prayers', { title: 'Prayer Requests', user});
});

app.get('/about', (req,res) => {
	res.render('about', { title: 'About', user });

});

app.get('/add-message', (req, res) => {
	res.render('add-message', { title: 'Add a message', user });
});

app.get('/add-verse', (req,res) => {
	res.render('add-verse', { title: 'Add a verse', user });
});

app.get('/add-prayer', (req,res) => {
	res.render('add-prayer', { title: 'Add a Prayer', user });
});

app.post('/add-message', (req, res) => {
	console.log(req.body);
	db.serialize(() => {
		db.run("INSERT INTO Messages(date,topic,message,username) VALUES($date,$topic,$message,$user);", {$date: startTime(), $topic: req.body.topic,$message: req.body.message, $user: user}, (err) => {
			if(err) {
				throw err;
			}
		});
		db.all("SELECT * FROM Messages;", (err, rows) => {
			// console.log("rows: ", rows);
			messages = rows;
			// console.log('messages in the login: ', messages);
			res.render('Messages', {title: 'Messages', user, messages});
		});	
	});
});

app.post('/add-verse', (req,res) => {
	// console.log(req.body);
	db.serialize(() => {
		db.run("INSERT INTO Verses(book,verse,version,reading,meaning,username) VALUES($book,$verse,$version,$read,$mean,$user);", {$book: req.body.book, $verse: req.body.verse, $version: req.body.version, $read: req.body.reading, $mean: req.body.meaning, $user: user}, (err) => {
			if(err) {
				throw err;
			}
		});
		db.all("SELECT * FROM Verses;", (err, rows) => {
			// console.log("rows: ", rows);
			verses = rows;
			// console.log('verses in the login: ', verses);
			res.render('index', {title: 'Home', user, verses});
		});	
	});
});

app.post('/add-prayer', (req,res) => {
	console.log(req.body);
});









app.listen(PORT, () => {
	console.log(`The server is live and listening on PORT: ${PORT}`);
});