//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var dotenv = require('dotenv');
var pg = require('pg');
var app = express();

//client id and client secret here, taken from .env
dotenv.load();

//connect to database
var conString = process.env.DATABASE_CONNECTION_URL;

//Configures the Template engine
app.engine('handlebars', handlebars({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat',
                  saveUninitialized: true,
                  resave: true}));

//set environment ports and start application
app.set('port', process.env.PORT || 3000);

//routes
app.get('/', function(req, res){
  res.render('index');
});

app.get('/map', function(req, res){
  res.render('map', { user: req.user });
});

app.get('/about', function(req, res){
  res.render('about', { user: req.user });
});

app.get('/contact', function(req, res){
  res.render('contact', { user: req.user });
});

app.get('/help', function(req, res){
  res.render('help', { user: req.user });
});


//FOR SEARCH TABLE in JumboTron
app.get('/zip', function (req, res) {
  console.log("In SEARCHZIP");
  pg.connect(conString, function(err, client, done) {
    if(err) return console.log(err);
    //var zcode = document.getElementById('zip');
    var query = "select distinct community, zip from arjis_crimes order by community asc";
    client.query(query, function(err, result) {
      // return the client to the connection pool for other requests to reuse
      done();

      res.writeHead("200", {'content-type': 'application/json'});
      res.end(JSON.stringify(result.rows));
    });
  });
});

app.get('/delphidata', function (req, res) {
    // test variable
    var active = 1;

    // initialize connection pool 
    if(active == 0){
      pg.connect(conString, function(err, client, done) {
        if(err) return console.log(err);
        //var zcode = document.getElementById('zip');
        var query = "SELECT * FROM arjis_crimes WHERE (zip='91950')";
        client.query(query, function(err, result) {
          // return the client to the connection pool for other requests to reuse
          done();

          res.writeHead("200", {'content-type': 'application/json'});
          res.end(JSON.stringify(result.rows));
        });
      });
    }

    //allows for users' input
    if(active == 1){
      pg.connect(conString, function(err, client, done) {
        var handleError = function(err, res) {
          // no error occurred, continue with the request
          if(!err) return false;
          else console.log(err);

          // An error occurred, remove the client from the connection pool.
          // A truthy value passed to done will remove the connection from the pool
          // instead of simply returning it to be reused.
          // In this case, if we have successfully received a client (truthy)
          // then it will be removed from the pool.
          done(client);
          res.writeHead("500", {'content-type': 'text/plain'});
          res.end('An error occurred');
          return true;
        };    

        var args = [];
        var query = "SELECT * FROM arjis_crimes";
        //console.log(query);
        // filter by zip code if available, otherwise return all data'
        if(req.query.zipcode && isNumber(req.query.zipcode)) {
          query += " WHERE zip='" + req.query.zipcode + "'";
          //args.push(req.query.zipcode);
          console.log("############ " + query);
        }else if(req.query.zipcode){
          query += " WHERE agency='" + req.query.zipcode.toUpperCase() + "'";
        }
        console.log(query);
        client.query(query, args, function(err, result) {
          if(handleError(err, res)) return;

          // return the client to the connection pool for other requests to reuse
          done();

          res.writeHead("200", {'content-type': 'application/json'});
          res.end(JSON.stringify(result.rows));
        });
      });
    }
    if(active == 2){
        pg.connect(conString, function(err, client, done) {
        var handleError = function(err, res) {
          // no error occurred, continue with the request
          if(!err) return false;
          else console.log(err);

          // An error occurred, remove the client from the connection pool.
          // A truthy value passed to done will remove the connection from the pool
          // instead of simply returning it to be reused.
          // In this case, if we have successfully received a client (truthy)
          // then it will be removed from the pool.
          done(client);
          res.writeHead("500", {'content-type': 'text/plain'});
          res.end('An error occurred');
          return true;
        };    

        var args = [];
        var query = "select charge_description, count(*) as num from arjis_crimes";
        //var query = "select * from arjis_crimes";
        //console.log(query);
        // filter by zip code if available, otherwise return all data'
        if(req.query.zipcode) {
          query += " WHERE zip='" + req.query.zipcode + "' group by charge_description order by count(*) desc limit 10";
          //query += " WHERE zip='" + req.query.zipcode + "'";
          //args.push(req.query.zipcode);
          console.log("############ " + query);
        }
        console.log(query);
        client.query(query, args, function(err, result) {
          if(handleError(err, res)) return;

          // return the client to the connection pool for other requests to reuse
          done();

          res.writeHead("200", {'content-type': 'application/json'});
          res.end(JSON.stringify(result.rows));
        });
      });
    }
  });

app.get('/getQuery', function (req, res) {
    //allows for users' input
    pg.connect(conString, function(err, client, done) {
        var handleError = function(err, res) {
          // no error occurred, continue with the request
          if(!err) return false;
          else console.log(err);

          // An error occurred, remove the client from the connection pool.
          // A truthy value passed to done will remove the connection from the pool
          // instead of simply returning it to be reused.
          // In this case, if we have successfully received a client (truthy)
          // then it will be removed from the pool.
          done(client);
          res.writeHead("500", {'content-type': 'text/plain'});
          res.end('An error occurred');
          return true;
        };    

        var args = [];
        var query = "select charge_description, count(*) as num from arjis_crimes";
        //var query = "select * from arjis_crimes";
        //console.log(query);
        // filter by zip code if available, otherwise return all data'
        if(req.query.zipcode  && isNumber(req.query.zipcode)) {
          query += " WHERE zip='" + req.query.zipcode + "' group by charge_description order by count(*) desc limit 10";
          //query += " WHERE zip='" + req.query.zipcode + "'";
          //args.push(req.query.zipcode);
          console.log("############ " + query);
        } else if(req.query.zipcode){
          query += " WHERE agency='" + req.query.zipcode.toUpperCase() + "' group by charge_description order by count(*) desc limit 10";
        }
        console.log(query);
        client.query(query, args, function(err, result) {
          if(handleError(err, res)) return;

          // return the client to the connection pool for other requests to reuse
          done();

          res.writeHead("200", {'content-type': 'application/json'});
          res.end(JSON.stringify(result.rows));
        });
      });
  });

app.get('/getQuery/2013', function (req, res) {
    //allows for users' input
    pg.connect(conString, function(err, client, done) {
        var handleError = function(err, res) {
          // no error occurred, continue with the request
          if(!err) return false;
          else console.log(err);

          // An error occurred, remove the client from the connection pool.
          // A truthy value passed to done will remove the connection from the pool
          // instead of simply returning it to be reused.
          // In this case, if we have successfully received a client (truthy)
          // then it will be removed from the pool.
          done(client);
          res.writeHead("500", {'content-type': 'text/plain'});
          res.end('An error occurred');
          return true;
        };    

        var args = [];
        var query = "select charge_description, count(*) as yr1 from arjis_crimes";
  
        //var query = "select * from arjis_crimes";
        //console.log(query);
        // filter by zip code if available, otherwise return all data'
        if(req.query.zipcode && isNumber(req.query.zipcode)) {
          query += " WHERE zip='" + req.query.zipcode + "' and date_part('year', activity_date)='2013' group by charge_description order by count(*) desc limit 10";
          //query += " WHERE zip='" + req.query.zipcode + "' group by charge_description limit 10";
          //args.push(req.query.zipcode);
          console.log("############ " + query);
        } else if(req.query.zipcode){
          query += " WHERE agency='" + req.query.zipcode.toUpperCase() + "' and date_part('year', activity_date)='2013' group by charge_description order by count(*) desc limit 10";
        }
        console.log(query);
        client.query(query, args, function(err, result) {
          if(handleError(err, res)) return;

          // return the client to the connection pool for other requests to reuse
          done();

          res.writeHead("200", {'content-type': 'application/json'});
          res.end(JSON.stringify(result.rows));
        });
      });
  });

app.get('/getQuery/2014', function (req, res) {
    //allows for users' input
    pg.connect(conString, function(err, client, done) {
        var handleError = function(err, res) {
          // no error occurred, continue with the request
          if(!err) return false;
          else console.log(err);

          // An error occurred, remove the client from the connection pool.
          // A truthy value passed to done will remove the connection from the pool
          // instead of simply returning it to be reused.
          // In this case, if we have successfully received a client (truthy)
          // then it will be removed from the pool.
          done(client);
          res.writeHead("500", {'content-type': 'text/plain'});
          res.end('An error occurred');
          return true;
        };    

        var args = [];
        var query = "select charge_description, count(*) as yr1 from arjis_crimes";
  
        //var query = "select * from arjis_crimes";
        //console.log(query);
        // filter by zip code if available, otherwise return all data'
        if(req.query.zipcode  && isNumber(req.query.zipcode)) {
          query += " WHERE zip='" + req.query.zipcode + "' and date_part('year', activity_date)='2014' group by charge_description order by count(*) desc limit 10";
          //query += " WHERE zip='" + req.query.zipcode + "' group by charge_description limit 10";
          //args.push(req.query.zipcode);
          console.log("############ " + query);
        } else if(req.query.zipcode){
          query += " WHERE agency='" + req.query.zipcode.toUpperCase() + "' and date_part('year', activity_date)='2014' group by charge_description order by count(*) desc limit 10";
        }
        console.log(query);
        client.query(query, args, function(err, result) {
          if(handleError(err, res)) return;

          // return the client to the connection pool for other requests to reuse
          done();

          res.writeHead("200", {'content-type': 'application/json'});
          res.end(JSON.stringify(result.rows));
        });
      });
  });

////////////////////// WORD CLOUD ////////////////////////////////////////////

app.get('/wordCloud', function (req, res) {
    // initialize connection pool 
    console.log("@@@@ Inside APP.js wordCloud");
        
    pg.connect(conString, function(err, client, done) {
        var handleError = function(err, res) {
          // no error occurred, continue with the request
          if(!err) return false;
          else console.log(err);

          // An error occurred, remove the client from the connection pool.
          // A truthy value passed to done will remove the connection from the pool
          // instead of simply returning it to be reused.
          // In this case, if we have successfully received a client (truthy)
          // then it will be removed from the pool.
          done(client);
          res.writeHead("500", {'content-type': 'text/plain'});
          res.end('An error occurred');
          return true;
        };    

        var args = [];
        var query = "select charge_description, count(*) as num from arjis_crimes";
        //var query = "select * from arjis_crimes";
        //console.log(query);
        // filter by zip code if available, otherwise return all data'
        if(req.query.zipcode && isNumber(req.query.zipcode)) {
          query += " WHERE zip='" + req.query.zipcode + "' group by charge_description order by count(*) desc limit 30";
          //query += " WHERE zip='" + req.query.zipcode + "'";
          //args.push(req.query.zipcode);
        }else if(req.query.zipcode){
          query += " WHERE agency='" + req.query.zipcode.toUpperCase() + "' group by charge_description order by count(*) desc limit 30";
        }
        console.log(query);
        client.query(query, args, function(err, result) {
          if(handleError(err, res)) return;

          // return the client to the connection pool for other requests to reuse
          done();

          res.writeHead("200", {'content-type': 'application/json'});
          res.end(JSON.stringify(result.rows));
        });
    });
});

////////////////////// END WORD CLOUD ////////////////////////////////////////




////////////////////// CRIME TIME ////////////////////////////////////////////


////////////////////// END CRIME TIME ////////////////////////////////////////

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
