//import important modules
const express = require('express');     //connect/run server
const cors = require('cors');           //connect/run server
const mysql = require('mysql2');        //SQL
// const fs = require('node:fs');          //reading fies

//set up server connection
const app = express();
const PORT = 3000;

// Enable CORS so frontend can access this server
app.use(cors());
app.use(express.json());

//set up SQL connection info
let con = mysql.createConnection({
  host: "localhost",
  user: "flashcard_user",        //limited permission user
  password: "FLASH!card12345",
  database: "flashcardData"
});

//connec to SQL server
con.connect(function(err) {
  if (err) throw err;

  //inform connection
  console.log("Connected!");

  //check tables
  let sql = "SHOW TABLES;";
  con.query(sql, function (err, result, fields) {
    if (err) {
        throw err;
    }

    console.log(result);
  });
});


/**
 * checkSet SQL function
 * 
 * Check if set with given set name and userid exists. If it exists
 * then send back the set_id of the the given set
 * 
 * parameters: 
 *      set - the name of the set
 *      userid - the id of the user associated with set
 * sends: set_id of found set
 */
app.get('/api/checkSet', (req, res) => {
    //save parameters from client's query
    const setname = req.query.set;
    const userid = req.query.userid;

    //create SQL statement
    let sql = "SELECT set_id FROM FSETS WHERE user_id = ? AND set_name = ?;";

    //on SQL connection, run query
    con.query(sql, [userid, setname], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("checkSet worked!");
        
        //send result of query back to client
        res.json({ data: result});
    });
});

/**
 * updateSetName SQL function
 * 
 * Update the name of the set with the given set name that is associated
 * the the primary key info (user_id, set_id) given in the client query
 * 
 * parameters: 
 *      userid - the id of the user associated with set
 *      setuid - the id of the set 
 *      setname - the new name of the set
 * sends: sucess if no error is thrown
 */
app.get('/api/updateSetName', (req, res) => {
    //save parameters from client's query
    const userid = req.query.userid;
    const setid = req.query.setid;
    const setname = req.query.setname;

    //create SQL query to update set name
    let sql = "UPDATE FSETS SET set_name = ? WHERE user_id = ? AND set_id = ?;";

    //send query on SQL connection
    con.query(sql, [setname, userid, setid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("updateSetName worked!");

        //send sucess if no error occured
        res.json({ data: 'sucess'});
    });
});


app.get('/api/addSet', (req, res) => {
    const userid = req.query.userid;
    const setid = req.query.setid;
    const set = req.query.set;

    let sql = "INSERT INTO FSETS (user_id, set_id, set_name, num_cards, progress) VALUES (?, ?, ?, 0, 0);";
    con.query(sql, [userid, setid, set], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("add set worked!");

        res.json({ data: 'sucess'});
    });

    sql = "UPDATE USERS SET num_sets = num_sets + 1 WHERE user_id = ?;";
    con.query(sql, [userid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("add set updated userid!");
    });
});

app.get('/api/deleteSet', (req, res) => {
    const userid = req.query.userid;
    const setid = req.query.setid;

    let sql = "DELETE FROM FSETS WHERE user_id = ? AND set_id = ?;";
    con.query(sql, [userid, setid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("delete set worked!");

        res.json({ data: 'sucess'});
    });

    sql = "UPDATE USERS SET num_sets = num_sets - 1 WHERE user_id = ?;";
    con.query(sql, [userid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("delete set updated userid!");
    });
});

app.get('/api/getSetCards', (req, res) => {
    const userid = req.query.userid;
    const setid = req.query.setid;

    let sql = "SELECT card_id, question, answer, percent, favorite FROM CARD WHERE user_id = ? AND set_id = ?;";
    con.query(sql, [userid, setid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("getSetCards worked!");

        res.json({ data: result});
    });
});

app.get('/api/getCardEdit', (req, res) => {
    const userid = req.query.userid;
    const setid = req.query.setid;

    let sql = "SELECT card_id, question, answer, favorite FROM CARD WHERE user_id = ? AND set_id = ? ORDER BY card_id;";
    con.query(sql, [userid, setid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("getCardEdit worked!");

        res.json({ data: result});
    });
});

app.get('/api/addCard', (req, res) => {
    const userid = req.query.userid;
    const setid = req.query.setid;
    const cardid = req.query.cardid;
    const question = req.query.question;
    const answer = req.query.answer;

    let sql = "INSERT INTO CARD (user_id, set_id, card_id, question, answer, percent, favorite) VALUES (?, ?, ?, ?, ?, 0, FALSE);";
    con.query(sql, [userid, setid, cardid, question, answer], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("addCard worked!");
    });

    sql = "UPDATE FSETS SET num_cards = num_cards + 1 WHERE user_id = ? AND set_id = ?;";
    con.query(sql, [userid, setid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }
        console.log("add card updated userid!");
    });

    res.json({ data: 'sucess'});
});

app.get('/api/updatePercent', (req, res) => {
    const userid = req.query.userid;
    const setid = req.query.setid;
    const cardid = req.query.cardid;
    const percent = req.query.percent;
    const favorite = req.query.favorite;

    let sql = "UPDATE CARD SET percent = ? WHERE user_id = ? AND set_id = ? AND card_id = ?;";
    con.query(sql, [percent, userid, setid, cardid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("updatePercent worked!");

        res.json({ data: 'sucess'});
    });
});

app.get('/api/updateCardQA', (req, res) => {
    const userid = req.query.userid;
    const setid = req.query.setid;
    const cardid = req.query.cardid;
    const question = req.query.question;
    const answer = req.query.answer;

    let sql = "UPDATE CARD SET question = ?, answer = ? WHERE user_id = ? AND set_id = ? AND card_id = ?;";
    con.query(sql, [question, answer, userid, setid, cardid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("updateCardQA worked!");

        res.json({ data: 'sucess'});
    });
});

app.get('/api/deleteCard', (req, res) => {
    const userid = req.query.userid;
    const setid = req.query.setid;
    const cardid = req.query.cardid;

    let sql = "DELETE FROM CARD WHERE user_id = ? AND set_id = ? AND card_id = ?;";
    con.query(sql, [userid, setid, cardid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("deleteCard worked!");
    });

    sql = "UPDATE FSETS SET num_cards = num_cards - 1 WHERE user_id = ? AND set_id = ?;";
    con.query(sql, [userid, setid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }
        console.log("deleteCard updated numcards!");
    });

    res.json({ data: 'sucess'});
});


app.get('/api/homepage', (req, res) => {
    const userid = req.query.userid;

    let sql = "SELECT * FROM FSETS WHERE user_id=?;";
    con.query(sql, [userid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("homepage worked!");

        res.json({ data: result});
    });
});

// app.get('/api/fileread', (req, res) => {
//     const filepath = req.query.file;
//     // console.log(filepath);

//     fs.readFile(filepath, 'utf8', (err, data) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//         // console.log(data);
//         res.json({ data: data});
//     })
//     // res.json({ message: "Hello from the Node.js backend!" });
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
