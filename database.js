var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE FlightComp (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pnr text, 
            passaddress text, 
            passname text,
            flightno text, 
            hash text,
            receipt text
            )`,
        (err) => {
            if (err) {
                // Table already created
                console.log("table already exits")
            }else{
                
            }
        });  


         db.run(`CREATE TABLE Approved (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pnr text, 
            flightno text
           
            )`,
        (err) => {
            if (err) {
                // Table already created
                console.log("table already exits")
            }else{
                
            }
        });  
    }
});


module.exports = db