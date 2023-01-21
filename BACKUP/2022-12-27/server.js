const express = require('express');
const bodyParser= require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

var db
const MongoClient = require('mongodb').MongoClient


MongoClient.connect('mongodb://fizzypi.lan:27017/test', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})


//app.listen(3000, function() {
//  console.log('listening on 3000')
//})

//app.get('/', function(req, res) {
  //res.send('Hello World')
//  res.sendFile(__dirname + '/index.html')
//})

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

app.get('/reflectionsdata', (req, res) => {
  //var cursor = db.collection('quotes').find()
  db.collection('reflections').find().toArray(function(err, results) {
    console.log(results);
    res.send(results);
  })
})


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
})
