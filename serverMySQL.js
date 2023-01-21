const express = require('express');
//const bodyParser= require('body-parser')
const app = express();
// use express.json after express 4.16
// https://stackoverflow.com/a/64970911
app.use(express.json());
// below for pre-express 4.16
// app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

var db
const MongoClient = require('mongodb').MongoClient;
const ObjectId    = require('mongodb').ObjectId;
var mysql = require('mysql');

MongoClient.connect('mongodb://fizzypi.lan:27017/test', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3300, () => {
    console.log('listening on 3300')
  })
})

var con = mysql.createConnection({
  host         : "fizzypi.lan",
  user         : "monty",
  password     : "some_pass",
  database     : "reflections",
  insecureAuth : true
});
con.connect();



app.get('/api/ref/episode', (req, res) => {

  con.query("SELECT * FROM v_episodes", function(err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
  
})



app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
})

app.get('/reflect', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('reflect.ejs', {quotes: result})
  })
})

app.get('/refs', (req, res) => {
  db.collection('reflections').find().toArray(function(err, results) {
    console.log(results);
    res.send(results);
    //  res.sendfile(__dirname + '/index.html')
    // send HTML file populated with quotes here
  })
})


app.get('/test', (req, res) => {
    res.sendfile(__dirname + '/index.html')
    // send HTML file populated with quotes here
})



app.get('/weatherdata', (req, res) => {
  //var cursor = db.collection('quotes').find()
  db.collection('sunTimes').find().toArray(function(err, results) {
    console.log(results);
    res.send(results);
//  res.sendfile(__dirname + '/index.html')
    // send HTML file populated with quotes here
  })

  // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
  // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
})

//---------------------------------------------------------------------------------------------------------
// Reflections - get all episodes
//---------------------------------------------------------------------------------------------------------
app.get('/reflectionsdata', (req, res) => {
  db.collection('reflections').find().toArray(function(err, results) {
    console.log(results);
    res.send(results);
  })
})

//---------------------------------------------------------------------------------------------------------
// Reflections - update one episode (in progress)
//---------------------------------------------------------------------------------------------------------
app.put('/reflectionsdata', (req, res) => {
  const objectId = new ObjectId(req.body._id)  ;
  //remove id before updating object
  delete req.body._id;
  db.collection('reflections').findOneAndUpdate({_id: objectId}, req.body, function(err, result) {
    if (err) return console.log(err)
    db.collection('reflections').find().toArray(function(err, results) {
      res.send(results);
    })
  });
});

//---------------------------------------------------------------------------------------------------------
// Reflections - create one episode (in progress)
//---------------------------------------------------------------------------------------------------------
app.post('/reflectionsdata', (req, res) => {
  console.log(req.body);
  db.collection('reflections').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database - Season:[' + req.body.season + '] Episode: [' + req.body.episode + ']')
    db.collection('reflections').find().toArray(function(err, results) {
      res.send(results);
    });
  });
});

//---------------------------------------------------------------------------------------------------------
// Reflections - delete one episode (in progress)
//---------------------------------------------------------------------------------------------------------
app.delete('/reflectionsdata', (req, res) => {
  console.log(req.body);
  db.collection('reflections').find().toArray(function(err, results) {
  //  console.log(results);
    res.send(results);
  })
});


// app.get('/', (req, res) => {
//   //var cursor = db.collection('quotes').find()
// //  db.collection('sunTimes').find().toArray(function(err, results) {
// //    console.log(results);
// //    res.send(results);
//   res.sendfile(__dirname + '/index.html')
//     // send HTML file populated with quotes here
// //  })
// 
//   // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
//   // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
// })

app.post('/quotes', (req, res) => {
 db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
	    console.log('saved to database - Quote:[' + req.body.quote + '] By: [' + req.body.name + ']')
//    console.log('saved to database')
    res.redirect('/')
  })
//  console.log(req.body)
})

app.post('/delquote', (req, res) => {
    db.collection('quotes').findOneAndDelete({"name": req.body.name,"quote": req.body.quote }, (err, result) => {
        if (err) return console.log(err)
            console.log('deleted from database - Quote:[' + req.body.quote + '] By: [' + req.body.name + ']')
        res.redirect('/')
    })
});

