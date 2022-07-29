const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bibleVerse.db');


// db.serialize(() => {
	// db.run("CREATE TABLE Users(username TEXT PRIMARY KEY, password TEXT NOT NULL)", (error) =>{
	// 	if(error) {
	// 		throw error;
	// 	}
	// });
	// db.run("CREATE TABLE Verses(book TEXT NOT NULL, verse TEXT NOT NULL, reading TEXT NOT NULL, meaning TEXT, version TEXT, username TEXT, FOREIGN KEY(username) REFERENCES Users(username) )", (error) =>{
	// 	if(error) {
	// 		throw error;
	// 	}
	// });
	// db.run("CREATE TABLE Messages(topic TEXT NOT NULL, message TEXT NOT NULL,  username TEXT, FOREIGN KEY(username) REFERENCES Users(username) )", (error) =>{
	// 	if(error) {
	// 		throw error;
	// 	}
	// });
	// db.run("CREATE TABLE Prayers(prayer TEXT NOT NULL, username TEXT, FOREIGN KEY(username) REFERENCES Users(username))", (error) =>{
	// 	if(error) {
	// 		throw error;
	// 	}
	// });
// 	db.run("INSERT INTO Verses(book,verse,reading,meaning,version,username) VALUES('James', '1: 2-4', 'Dear Brotheres and Sisters, when troubles come your way , consider it an opportunity for great joy. For you know that when your faith is tested, your endurance has a chance to grow, for when your endurance if fully developed, you will perfect and complete needing nothing.', 'Dont give up hope and keep moving forward because you are not alone. Jesus is by your side. You will strengthen your endurance', 'NLT Study Bible', 'lopez87')", (error) => {});
// 	db.all('SELECT * FROM Verses', (err, rows) => {
// 		console.table(rows);
// 	})
// });

// db.close();
module.exports = db;