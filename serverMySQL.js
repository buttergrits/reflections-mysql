// for pi-photo-app  =================================================

//const fs = require('fs');
import fs from'fs';
//const path = require('path');
import path from'path';

// ===================================================================



import { BibleGatewayAPI } from "bible-gateway-api";
let bgw = new BibleGatewayAPI();

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//const bgw = require('bible-gateway-api');
//let bgw = new BibleGatewayAPI();

//const express = require('express');
import express from 'express';

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
//const MongoClient = require('mongodb').MongoClient;
//const ObjectId    = require('mongodb').ObjectId;
//var mysql = require('mysql');
import mysql from 'mysql2'

//MongoClient.connect('mongodb://fizzypi.lan:27017/test', (err, database) => {
//  if (err) return console.log(err)
//  db = database
//  app.listen(3300, () => {
//    console.log('listening on 3300')
//  })
//})

// var con = mysql.createConnection({
//   host         : "fizzypi.lan",
//   user         : "monty",
//   password     : "some_pass",
//   database     : "reflections",
//   insecureAuth : true,
//   typeCast     : function castField( field, useDefaultTypeCasting ) {
// 
//     // We only want to cast bit fields that have a single-bit in them. If the field
//     // has more than one bit, then we cannot assume it is supposed to be a Boolean.
//     if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
// 
//         var bytes = field.buffer() ?? [0];
// 
//         // A Buffer in Node represents a collection of 8-bit unsigned integers.
//         // Therefore, our single "bit field" comes back as the bits '0000 0001',
//         // which is equivalent to the number 1.
//         return( bytes[ 0 ]  ) === 1 ;
// 
//     }
//     return( useDefaultTypeCasting() );
// }
// });
// con.connect();

app.listen(3300, () => {
  console.log('listening on 3300')
})

// -------------------------------------------------------------------------------------------------------
// Using 'pool' below addresses issue where a mySQL connection is eventually lost, causing app exception.  
// The solution uses mySQL connection pool to manage the connection, elimitating the timeout issue.
// See url's below:
// - https://stackoverflow.com/questions/75593795/mysql-close-connection-after-some-hours  (question)
// - https://github.com/sidorares/node-mysql2/issues/836#issuecomment-414281593            (answer)
// -------------------------------------------------------------------------------------------------------
const pool = mysql.createPool({
  //host    : 'fizzypi.lan',
  host    : 'fiz.lan',
  user    : 'monty',
  database: 'reflections',
  password: 'some_pass'
});




//------------------------------------------------------------------------------------------
// Episode apis
//------------------------------------------------------------------------------------------
// load
app.get('/api/ref/episode/:id?', (req, res) => {
  var qry = `SELECT 
             id, seasonNum, episodeNum, episodeNumAlt, (COALESCE(doneScriptures, 0) = 1) as doneScriptures, locationCount, numLocsWithScrs, numLocsWithoutScrs, episodeTag, notes
             FROM v_episodes ` 
  if(req.params.id)
      qry += ` WHERE id=${req.params.id};`
  else
      qry += ` ORDER BY episodeTag;`

  pool.query(qry, function(err, result) {
    if (err) throw err;
    console.log(result?.length);
    res.send(result);
  });
})
//------------------------------------------------------------------------------------------
// update
app.put('/api/ref/episode', (req, res) => {
  //res.send(req.body);
  var sql = `UPDATE episodes 
             SET    seasonNum      = ?,
                    episodeNum     = ?, 
                    episodeNumAlt  = ?,
                    doneScriptures = ?,
                    notes          = ? 
             WHERE id = ?
             LIMIT 1`;
  var data = [
    req.body.seasonNum,
    req.body.episodeNum,
    req.body.episodeNumAlt,
    req.body.doneScriptures,
    req.body.notes,
    req.body.id,
  ];
  pool.query(sql, data, (error, results, fields) => {
    if (error){
      return console.error(error.message);
    }
    console.log('Rows affected:', results.affectedRows);
    console.log('Fields:', fields);
    res.send(results);
  });  
})
//------------------------------------------------------------------------------------------
// create
app.post('/api/ref/episode', (req, res) => {
  var sql = `INSERT INTO episodes (seasonNum, episodeNum, episodeNumAlt, notes)
             VALUES               (?, ?, ?, ?)`;
  var data = [
    req.body.seasonNum,
    req.body.episodeNum,
    req.body.episodeNumAlt,
    req.body.notes
  ];
  pool.query(sql, data, (error, results, fields) => {
     if (error){
       return console.error(error.message);
     }
     console.log('Rows affected:', results.affectedRows);
     console.log('Fields:', fields);
     res.send(results);
   });  
})
 //------------------------------------------------------------------------------------------
// delete
app.delete('/api/ref/episode/:id', (req, res) => {
  var sql = `DELETE FROM  episodes
             WHERE  id = ?
             LIMIT 1`;
  var data = [
    req.params.id,
  ];
  //res.send(req.params.id);
  pool.query(sql, data, (error, results, fields) => {
     if (error){
       return console.error(error.message);
     }
     console.log('Rows affected:', results.affectedRows);
     console.log('Fields:', fields);
     res.send(results);
   });  
})

//------------------------------------------------------------------------------------------
// Location apis
//------------------------------------------------------------------------------------------
// load
app.get('/api/ref/location/:id?', (req, res) => {
  var qry = "SELECT * FROM v_locations";
  if(req.params.id)
      qry = `SELECT * FROM v_locations WHERE id=${req.params.id}`

  pool.query(qry, function(err, result) {
    if (err) throw err;
    console.log(result?.length);
    res.send(result);
  });
})
//------------------------------------------------------------------------------------------
// update
app.put('/api/ref/location', (req, res) => {
  //res.send(req.body);
  var sql =  `UPDATE locations 
              SET   episodeId         = ?,
                    locationNum       = ?,
                    locationName      = ?, 
                    locationProv      = ?,
                    locationCountry   = ?,
                    song              = ?,
                    startTime         = ? 
              WHERE id = ?
              LIMIT 1`;
  var data = [
    req.body.episodeId       ,
    req.body.locationNum     ,
    req.body.locationName    ,
    req.body.locationProv    ,
    req.body.locationCountry ,
    req.body.song            ,
    req.body.startTime       ,
    req.body.id
  ];
  pool.query(sql, data, (error, results, fields) => {
    if (error){
      return console.error(error.message);
    }
    console.log('Rows affected:', results.affectedRows);
    console.log('Fields:', fields);
    res.send(results);
  });  
})
//------------------------------------------------------------------------------------------
// create
app.post('/api/ref/location', (req, res) => {
  var sql = `INSERT INTO locations (episodeId, locationNum, locationName, locationProv, locationCountry, song, startTime)
             VALUES                (?, ?, ?, ?, ?, ?, ?)`;
  var data = [
    req.body.episodeId       ,
    req.body.locationNum     ,
    req.body.locationName    ,
    req.body.locationProv    ,
    req.body.locationCountry ,
    req.body.song            ,
    req.body.startTime
  ];
  pool.query(sql, data, (error, results, fields) => {
     if (error){
       return console.error(error.message);
     }
     console.log('Rows affected:', results.affectedRows);
     console.log('Fields:', fields);
     res.send(results);
   });  
})
//------------------------------------------------------------------------------------------
// delete
app.delete('/api/ref/location/:id', (req, res) => {
  var sql = `DELETE FROM  locations
             WHERE  id = ?
             LIMIT 1`;
  var data = [
    req.params.id,
  ];
  //res.send(req.params.id);
  pool.query(sql, data, (error, results, fields) => {
     if (error){
       return console.error(error.message);
     }
     console.log('Rows affected:', results.affectedRows);
     console.log('Fields:', fields);
     res.send(results);
   });  
})

//------------------------------------------------------------------------------------------
// Scripture apis
//------------------------------------------------------------------------------------------
// load
app.get('/api/ref/scripture/:id?', (req, res) => {
  var qry = "SELECT * FROM v_scriptures";
  if(req.params.id)
      qry = `SELECT * FROM v_scriptures WHERE id=${req.params.id}`

  pool.query(qry, function(err, result) {
    if (err) throw err;
    console.log(result?.length);
    res.send(result);
  });
})
//------------------------------------------------------------------------------------------
// update
app.put('/api/ref/scripture', (req, res) => {
  //console.log(req.body);
  var sql =  `UPDATE scriptures 
              SET   locationId   = ?,
                    scriptureNum = ?,
                    book         = ?,
                    chapter      = ?,
                    verse        = ?,
                    translation  = ?,
                    text         = ?
              WHERE id = ?
              LIMIT 1`;
  var data = [
    req.body.locationId   ,
    req.body.scriptureNum ,
    req.body.book         ,
    req.body.chapter      ,
    req.body.verse        ,
    req.body.translation  ,
    req.body.text         ,
    req.body.id
  ];
  pool.query(sql, data, (error, results, fields) => {
    if (error){
      return console.error(error.message);
    }
    console.log('Rows affected:', results.affectedRows);
    console.log('Fields:', fields);
    res.send(results);
  });  
})
//------------------------------------------------------------------------------------------
// create
app.post('/api/ref/scripture', (req, res) => {
  var sql = `INSERT INTO scriptures (locationId, scriptureNum, book, chapter, verse, translation, text)
             VALUES                 (?, ?, ?, ?, ?, ?, ?)`;
  var data = [
    req.body.locationId   ,
    req.body.scriptureNum ,
    req.body.book         ,
    req.body.chapter      ,
    req.body.verse        ,
    req.body.translation  ,
    req.body.text
  ];
  pool.query(sql, data, (error, results, fields) => {
     if (error){
       return console.error(error.message);
     }
     console.log('Rows affected:', results.affectedRows);
     console.log('Fields:', fields);
     res.send(results);
   });  
})
//------------------------------------------------------------------------------------------
// delete
app.delete('/api/ref/scripture/:id', (req, res) => {
  var sql = `DELETE FROM  scriptures
             WHERE  id = ?
             LIMIT 1`;
  var data = [
    req.params.id,
  ];
  //res.send(req.params.id);
  pool.query(sql, data, (error, results, fields) => {
     if (error){
       return console.error(error.message);
     }
     console.log('Rows affected:', results.affectedRows);
     console.log('Fields:', fields);
     res.send(results);
   });  
})
//------------------------------------------------------------------------------------------
// lookup bible text
//------------------------------------------------------------------------------------------
app.post('/api/ref/scriptureLookup', async (req, res) => {
  console.log(req.body);
  try {
    let { verse, content } = await bgw.search(req.body.verse, req.body.tr);

    // Extract passage from api result
    var a = content;

    // remove excess items from array
    var b = a.slice(a.findIndex(e => e=='Store')+1                , 
            a.findIndex(e => e.startsWith('Sign Up for')) );

    // regex, trim, join into final string
    const regex = /\d+|\(.\)|\[.\]/gm;
    var c = b.map(b =>  b.replace(regex, '').trim()).join(' ');

    res.send({ verse : verse, content: content, text : c });
  } catch (error) {
    res.send({ verse : req.body.verse + ' -' + req.body.tr, error: error});
  }
})

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
// Bible Books
//------------------------------------------------------------------------------------------
// load
app.get('/api/ref/books/:id?', (req, res) => {
  var qry = "SELECT * FROM bible_books ORDER BY name";
  if(req.params.id)
      qry = `SELECT * FROM bible_books WHERE id=${req.params.id}`

  pool.query(qry, function(err, result) {
    if (err) throw err;
    console.log(`/api/ref/books - length:${result?.length}`);
    res.send(result);
  });
})
//------------------------------------------------------------------------------------------
// Bible Translations / versions
//------------------------------------------------------------------------------------------
// load
app.get('/api/ref/versions/:id?', (req, res) => {
  var qry = "SELECT * FROM bible_translations ORDER BY code";
  if(req.params.id)
      qry = `SELECT * FROM bible_translations WHERE id=${req.params.id}`

  pool.query(qry, function(err, result) {
    if (err) throw err;
    console.log(`/api/ref/versions - length:${result?.length}`);
    res.send(result);
  });
})
//------------------------------------------------------------------------------------------

//app.get('/', (req, res) => {
//  db.collection('quotes').find().toArray((err, result) => {
//    if (err) return console.log(err)
//    // renders index.ejs
//    res.render('index.ejs', {quotes: result})
//  })
//})

//app.get('/reflect', (req, res) => {
//  db.collection('quotes').find().toArray((err, result) => {
//    if (err) return console.log(err)
//    // renders index.ejs
//    res.render('reflect.ejs', {quotes: result})
//  })
//})

//app.get('/refs', (req, res) => {
//  db.collection('reflections').find().toArray(function(err, results) {
//    console.log(results);
//    res.send(results);
//    //  res.sendfile(__dirname + '/index.html')
//    // send HTML file populated with quotes here
//  })
//})


app.get('/test', (req, res) => {
    res.sendfile(__dirname + '/index.html')
    // send HTML file populated with quotes here
})



// app.get('/weatherdata', (req, res) => {
//   //var cursor = db.collection('quotes').find()
//   db.collection('sunTimes').find().toArray(function(err, results) {
//     console.log(results);
//     res.send(results);
// //  res.sendfile(__dirname + '/index.html')
//     // send HTML file populated with quotes here
//   })
// 
//   // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
//   // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
// })

//---------------------------------------------------------------------------------------------------------
// Reflections - get all episodes
//---------------------------------------------------------------------------------------------------------
//app.get('/reflectionsdata', (req, res) => {
//  db.collection('reflections').find().toArray(function(err, results) {
//    console.log(results);
//    res.send(results);
//  })
//})

//---------------------------------------------------------------------------------------------------------
// Reflections - update one episode (in progress)
//---------------------------------------------------------------------------------------------------------
// app.put('/reflectionsdata', (req, res) => {
//   const objectId = new ObjectId(req.body._id)  ;
//   //remove id before updating object
//   delete req.body._id;
//   db.collection('reflections').findOneAndUpdate({_id: objectId}, req.body, function(err, result) {
//     if (err) return console.log(err)
//     db.collection('reflections').find().toArray(function(err, results) {
//       res.send(results);
//     })
//   });
// });

//---------------------------------------------------------------------------------------------------------
// Reflections - create one episode (in progress)
//---------------------------------------------------------------------------------------------------------
// app.post('/reflectionsdata', (req, res) => {
//   console.log(req.body);
//   db.collection('reflections').save(req.body, (err, result) => {
//     if (err) return console.log(err)
//     console.log('saved to database - Season:[' + req.body.season + '] Episode: [' + req.body.episode + ']')
//     db.collection('reflections').find().toArray(function(err, results) {
//       res.send(results);
//     });
//   });
// });

//---------------------------------------------------------------------------------------------------------
// Reflections - delete one episode (in progress)
//---------------------------------------------------------------------------------------------------------
//app.delete('/reflectionsdata', (req, res) => {
//  console.log(req.body);
//  db.collection('reflections').find().toArray(function(err, results) {
//  //  console.log(results);
//    res.send(results);
//  })
//});


// app.post('/quotes', (req, res) => {
//  db.collection('quotes').save(req.body, (err, result) => {
//     if (err) return console.log(err)
// 	    console.log('saved to database - Quote:[' + req.body.quote + '] By: [' + req.body.name + ']')
// //    console.log('saved to database')
//     res.redirect('/')
//   })
// //  console.log(req.body)
// })

// app.post('/delquote', (req, res) => {
//     db.collection('quotes').findOneAndDelete({"name": req.body.name,"quote": req.body.quote }, (err, result) => {
//         if (err) return console.log(err)
//             console.log('deleted from database - Quote:[' + req.body.quote + '] By: [' + req.body.name + ']')
//         res.redirect('/')
//     })
// });


//---------------------------------------------------------------------------------------------------------
// *****   pi-photo-project  *****
//---------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------
// get top folder
//---------------------------------------------------------------------------------------------------------
app.get('/api/photo/topFolder', (req, res) => {
  var folders = getDirectories('E:\\DATA\\PHOTO\\_pi-photo-project\\photos');
  res.send(folders);
})

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}