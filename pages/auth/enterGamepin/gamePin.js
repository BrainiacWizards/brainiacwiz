const mysql = require('mysql');

// Create connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'quizgame'
});


// Connect the database
connection.connect((err) =>{
    if (err) {
        console.error('Error connecting to MySQL server: '+ err.stack);
        return;
    }
    console.log('Connected to MySQL server ');
});

function fetchDataFromMySQL() {
    const query = 'SELECT * FROM game_pins'; 

    connection.query(query, (error, results, fields) => {
        if(error){
            console.error('Error fetching data from MySQL: ' + error.stack);
            return;
        }

        let userInput = "4568KBG";
        if(userInput == results){
            console.log("We have the data!!!");
        } else {
            console.log("No data found");
        }
        console.log('Fetched data from MySQL:');
        console.log(results);
        
    });
}
fetchDataFromMySQL();

connection.end();