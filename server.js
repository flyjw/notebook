var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.set('Content-Type', 'application/json');
    next();
});

//建立数据库连接
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'notebook'
});
connection.connect(function(err) {
    if (err) throw err;
    console.log('connect success!');
});

//get notes
app.get('/notes', function(req, res) {
    connection.query('SELECT * FROM `notes`', function(err, rows, fields) {
        if (err) {
            res.status(500).end();
            return console.log(err);
        }
        res.status(200).send(JSON.stringify(rows));
        console.log('The solution is: ', JSON.stringify(rows));
    });
});

// Update a note
app.put('/notes/:id', function(req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var content = req.body.content;
    connection.query("UPDATE `notes` SET `title`= '" + title + "', `content` = '" + content + "' WHERE `id`= '" + id + "'", function(err, rows, fields) {
        if (err) {
            res.status(500).end();
            return console.log(err);
        }
        res.status(200).send(JSON.stringify(rows));
        console.log('The solution is: ', JSON.stringify(rows));
    });
});

// Create a new note
app.post('/notes', function(req, res) {
    var title = req.body.title;
    var content = req.body.content;
    connection.query("INSERT INTO `notes`(`title`, `content`) VALUES ('" + title + "','" + content + "')", function(err, rows, fields) {
        if (err) {
            res.status(500).end();
            return console.log(err);
        }
        res.status(200).send(JSON.stringify(rows));
        console.log('The solution is: ', JSON.stringify(rows));
    });
});

// Delete a note
app.delete('/notes/:id', function(req, res) {
    var id = req.params.id;
    console.log(id);   
    connection.query("DELETE FROM `notes` WHERE `id`= '" + id + "'", function(err, rows, fields) {
        if (err) {
            res.status(500).end();
            return console.log(err);
        }
        res.status(200).send(JSON.stringify(rows));
        console.log('The solution is: ', JSON.stringify(rows));
    });
});


// connection.end();

app.listen(3000, function() {
    console.log('Server started. Open http://localhost:3000 in your browser.');
});
