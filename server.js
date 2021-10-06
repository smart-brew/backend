var express = require('express');

var app = express();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

var PORT = 8000;

app.post('/', function(req, res) {
    console.log(req.body);
    res.json(req.body);
});

app.get('/', function(req, res) {
    res.status(200).send("Hello World!");
});

app.listen(PORT, function() {
    console.log('Server is running on PORT:',PORT);
});