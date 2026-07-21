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

//--------------------------------------------------------------------------------
//SQL functions for FSETS (set) manipulation -------------------------------------
//--------------------------------------------------------------------------------

/** checkSet SQL function
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

/** addSet SQL function
 * 
 * Add a set to FSETS table with given user_id, set_id, and set_name from
 * the client query. Additionally increases by one, the num_sets attribute
 * in USERS table for associated user_id
 * 
 * parameters: 
 *      userid - the id of the user associated with set
 *      setuid - the id of the new set 
 *      setname - the name of the new set
 * sends: sucess if no error is thrown
 */
app.get('/api/addSet', (req, res) => {
    //save parameters from client's query
    const userid = req.query.userid;
    const setid = req.query.setid;
    const setname = req.query.set;

    //create SQL query for creating new set in FSETS table
    let sql = "INSERT INTO FSETS (user_id, set_id, set_name, num_cards, progress) VALUES (?, ?, ?, 0, 0);";

    //run SQL query on connection
    con.query(sql, [userid, setid, setname], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("add set worked!");
    });


    //create SQL query for increasing num_sets by 1 for associated user_id
    sql = "UPDATE USERS SET num_sets = num_sets + 1 WHERE user_id = ?;";

    //run SQL query on connection
    con.query(sql, [userid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("add set updated userid!");
    });
    
    //send sucess if no errors occured
    res.json({ data: 'sucess'});
});

/** deleteSet SQL function
 * 
 * Delete set in FSETS table with primary key information given by client, 
 * (user_id, set_id). Additionally decreases num_sets by 1 in USERS table
 * for user associated with userid
 * 
 * parameters: 
 *      userid - the id of the user associated with set being deleted
 *      setuid - the id of the set being deleted
 * sends: sucess if no error is thrown
 */
app.get('/api/deleteSet', (req, res) => {
    //save parameters from client's query
    const userid = req.query.userid;
    const setid = req.query.setid;

    //create SQL query to delete set from FSETS
    let sql = "DELETE FROM FSETS WHERE user_id = ? AND set_id = ?;";

    //run SQL query on connection
    con.query(sql, [userid, setid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("delete set worked!");
    });

    //create SQL query to decrease num_sets by 1
    sql = "UPDATE USERS SET num_sets = num_sets - 1 WHERE user_id = ?;";

    //run SQL query on connection
    con.query(sql, [userid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("delete set updated userid!");
    });

    //send sucess as no error occured
    res.json({ data: 'sucess'});
});

/** updateSetName SQL function
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

//--------------------------------------------------------------------------------
//SQL functions for CARD (flashcard) manipulation --------------------------------
//--------------------------------------------------------------------------------

/** addCard SQL function
 * 
 * Add a card with given card_id, question, and answer infromation. user_id and set_id
 * associated card with a given set and user. percent and favorite are default 0 and
 * FALSE respectively. Additionally, increase num_cards in FSETS table by 1 for 
 * associated set, given by (user_id, set_id)
 * 
 * parameters: 
 *      userid - the id of the user associated with set/card
 *      setuid - the id of the set associated with card
 *      cardid - the id of the new card
 *      question - the value for the question of the new card
 *      answer - the value for the answer of the new card
 * sends: sucess if no error is thrown
 */
app.get('/api/addCard', (req, res) => {
    //save parameters from client's query
    const userid = req.query.userid;
    const setid = req.query.setid;
    const cardid = req.query.cardid;
    const question = req.query.question;
    const answer = req.query.answer;

    //create query to insert card into CARD table
    let sql = "INSERT INTO CARD (user_id, set_id, card_id, question, answer, percent, favorite) VALUES (?, ?, ?, ?, ?, 0, FALSE);";
    
    //run query on connection
    con.query(sql, [userid, setid, cardid, question, answer], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }

        console.log("addCard worked!");
    });

    //create query to update num_cards for associated set
    sql = "UPDATE FSETS SET num_cards = num_cards + 1 WHERE user_id = ? AND set_id = ?;";

    //run query on connection
    con.query(sql, [userid, setid], function (err, result, fields) {
        if (err) { 
            throw err;
            return;
        }
        
        console.log("addCard updated num_cards in FSETS!");
    });

    //send sucess as no error occured
    res.json({ data: 'sucess'});
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

app.get('/api/getCardsStudy', (req, res) => {
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

app.get('/api/getCardsEdit', (req, res) => {
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


//--------------------------------------------------------------------------------
//SQL functions MISC -------------------------------------------------------------
//--------------------------------------------------------------------------------

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
