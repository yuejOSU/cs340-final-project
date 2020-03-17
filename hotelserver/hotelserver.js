var express = require('express');
var mysql = require('./dbcon.js');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var path = require("path");

var bodyParser = require('body-parser')
var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.use(express.static(path.join(__dirname, '/public')));

app.get('/',function(req,res,next){
  res.render('home');
});

app.get('/create-customer-account',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT Customers.customer_id, Customers.first_name, Customers.last_name, Customers.email_address, Customers.age FROM Customers', function(err, rows, fields){
    context.results = rows;
    res.render('create-customer-account',context);
  });
});

app.post('/create-customer-account', function(req, res, next){
  var context = {};
  var params  = req.body;
  console.log("req.body: " + JSON.stringify(params));
  if(params.createCustomer) {
    mysql.pool.query('INSERT INTO Customers (first_name, last_name, email_address, age) VALUES ("'+params.first_name+'", "'+params.last_name+'", "'+params.email_address+'", "'+params.age+'")', params, function(err, results, fields){
      mysql.pool.query('INSERT INTO Bookings (cid, booking_date) VALUES ((SELECT AUTO_INCREMENT-1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = \'cs340_yuej\' AND TABLE_NAME = \'Customers\'), curdate())', function(err, results, fields){
        mysql.pool.query('SELECT Customers.customer_id, Customers.first_name, Customers.last_name, Customers.email_address, Customers.age FROM `Customers`', function(err, rows, fields){
          context.results = rows;
          res.render('create-customer-account',context);
        });
      });
    });
  }
});

app.get('/edit-customer-account',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT Customers.customer_id, CONCAT_WS(\' \', Customers.first_name, Customers.last_name) AS whole_name, Customers.first_name, Customers.last_name, Customers.email_address, Customers.age FROM Customers', function(err, rows, fields){
    context.results = rows;
    res.render('edit-customer-account',context);
  });
});

app.post('/edit-customer-account',function(req,res,next){
  var context = {};
  var params  = req.body;
  console.log("Params: " + JSON.stringify(params));
  mysql.pool.query('UPDATE Customers SET Customers.first_name = "'+params.first_name+'", Customers.last_name = "'+params.last_name+'", Customers.email_address = "'+params.email_address+'", Customers.age = "'+params.age+'" WHERE Customers.customer_id = "'+params.customer_id+'"', function(err, results, fields){
    mysql.pool.query('SELECT Customers.customer_id, Customers.first_name, Customers.last_name, Customers.email_address, Customers.age FROM `Customers`', function(err, rows, fields){
      context.results = rows;
      res.render('edit-customer-account',context);
    });
  });
});



app.get('/create-booking',function(req,res,next){
  var context = {};
    mysql.pool.query('SELECT Bookings.booking_id, Customers.customer_id, CONCAT_WS(\' \', Customers.first_name, Customers.last_name) AS whole_name, Customers.email_address, Bookings.booking_date FROM Bookings LEFT JOIN Customers ON Customers.customer_id = Bookings.cid', function(err, rows, fields){
      context.results = rows;
      mysql.pool.query('SELECT Rooms.room_id, Rooms.room_price FROM Rooms', function(err, rows, fields) {
        context.rooms = rows;
        res.render('create-booking',context);
      })
	  });
});

app.post('/create-booking', function(req, res, next){
  var context = {};
  var params  = req.body;
  console.log("req.body: " + JSON.stringify(params));
  if (params.addBooking == "Add") {
    mysql.pool.query('INSERT INTO Bookings (cid, booking_date) VALUES ("'+params.customer_id+'", "'+params.booking_date+'")', function(err, results, fields){
      mysql.pool.query('SELECT Bookings.booking_id, Customers.customer_id, CONCAT_WS(\' \', Customers.first_name, Customers.last_name) AS whole_name, Customers.email_address, Bookings.booking_date FROM Bookings LEFT JOIN Customers ON Customers.customer_id = Bookings.cid', function(err, rows, fields){
        context.results = rows;
        res.render('create-booking',context);
      });
    });
  }
});

app.get('/search-booking-details',function(req,res,next){
  var context = {};
  var params  = req.query;
   console.log("req.body: " + JSON.stringify(req.query)); //req.query.searchName
   if(req.query.filterByName) {
     mysql.pool.query('SELECT Booking_Details.booking_details_id, Bookings.booking_date, Booking_Details.booking_price, CONCAT_WS(\' \', Customers.first_name, Customers.last_name) AS whole_name, Rooms.room_id FROM Booking_Details LEFT JOIN Bookings ON Bookings.booking_id = Booking_Details.bid LEFT JOIN Customers ON Customers.customer_id = Bookings.cid RIGHT JOIN Rooms ON Rooms.room_id = Booking_Details.rid WHERE Customers.first_name = "'+params.searchFirstName+'" AND Customers.last_name = "'+params.searchLastName+'"', function(err, rows, fields){
       context.results = rows;
       res.render('search-booking-details',context);
     });
   }
   else if(req.query.filterByPrice) {
     mysql.pool.query('SELECT Booking_Details.booking_details_id, Bookings.booking_date, Booking_Details.booking_price, CONCAT_WS(\' \', Customers.first_name, Customers.last_name) AS whole_name, Rooms.room_id FROM Booking_Details LEFT JOIN Bookings ON Bookings.booking_id = Booking_Details.bid LEFT JOIN Customers ON Customers.customer_id = Bookings.cid RIGHT JOIN Rooms ON Rooms.room_id = Booking_Details.rid WHERE Customers.first_name != \'\' AND Booking_Details.booking_price >= "'+params.searchMinPrice+'" AND Booking_Details.booking_price <= "'+params.searchMaxPrice+'"', function(err, rows, fields){
       context.results = rows;
       res.render('search-booking-details',context);
     });
   }
   else {
      mysql.pool.query('SELECT Booking_Details.booking_details_id, Bookings.booking_date, Booking_Details.booking_price, CONCAT_WS(\' \', Customers.first_name, Customers.last_name) AS whole_name, Rooms.room_id FROM Booking_Details LEFT JOIN Bookings ON Bookings.booking_id = Booking_Details.bid LEFT JOIN Customers ON Customers.customer_id = Bookings.cid RIGHT JOIN Rooms ON Rooms.room_id = Booking_Details.rid WHERE Customers.first_name != \'\'', function(err, rows, fields){
        context.results = rows;

        // self-executing function that will figure out if a customer has multiple bookings
        (function multipleBookings() {
          // loop through each result separately
          for (let i = 0; i < context.results.length; i++) {
            var x;
            var count = 0;

            // loop through all results again
            for (let j = 0; j < context.results.length; j++) {
              // if both whole_names are the same then increase count of that person's bookings
              if (context.results[j].whole_name == context.results[i].whole_name) {
                count++;
              }
            }

            // if there are multiple bookings by one person, set new field 'multipleBookings' to true
            context.results[i].multipleBookings = (count > 1) ? true : false;
          }
        }) ()

        res.render('search-booking-details',context);
     });
   }
});

app.get('/add-new-rooms',function(req,res,next){
  var context = {};
    mysql.pool.query('SELECT Rooms.room_id, Rooms.room_price, Rooms.is_clean, Rooms.is_occupied FROM Rooms', function(err, rows, fields){
      context.results = rows;
	    res.render('add-new-rooms',context);
	  });
});

app.post('/add-new-rooms', function(req, res, next){
  var context = {};
  var params = req.body;

  if (params.is_clean === "true") {
    params.is_clean = true;
  } else {
    params.is_clean = false;
  }

  if (params.is_occupied === "true") {
    params.is_occupied = true;
  } else {
    params.is_occupied = false;
  }

  mysql.pool.query('INSERT INTO Rooms (room_price, is_clean, is_occupied) VALUES ("'+params.room_price+'", "'+params.is_clean+'", "'+params.is_occupied+'")', params, function(err, results, fields){
    mysql.pool.query('SELECT Rooms.room_id, Rooms.room_price, Rooms.is_clean, Rooms.is_occupied FROM Rooms', function(err, rows, fields){
      context.results = rows;
      console.log(context.result);
      res.render('add-new-rooms',context);
    });
  });
});

// GET request to delete row from table
app.get('/delete', function(req,res,next) {
  var context = {};

  var params = req.query;
  console.log("Delete: " + JSON.stringify(params));
  switch (params.table) {
    case 'Customers':
      params.table_id_clause = 'customer_id';
      break;
    case 'Rooms':
      params.table_id_clause = 'room_id';
      break;
  }

  mysql.pool.query('SELECT * FROM ' + params.table + ' WHERE ' + params.table_id_clause + '=' + params.id, function(err, result) {
    if(err) {
      next(err);
      return;
    }
    mysql.pool.query('DELETE FROM ' + params.table + ' WHERE ' + params.table_id_clause + '=' + params.id, function(err, result) {
      res.send(req.query);
    });
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
