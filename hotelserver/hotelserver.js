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

var x = 0;

app.get('/',function(req,res,next){
  var context = {};

  var createTables = [
  "CREATE TABLE IF NOT EXISTS `customers`(" +
  "`customer_id` INT(11) PRIMARY KEY AUTO_INCREMENT," +
  "`first_name` VARCHAR(255) NOT NULL," +
  "`last_name` VARCHAR(255) NOT NULL," +
  "`email` VARCHAR(255) NOT NULL," +
  "`age` INT(11) NOT NULL);",

  "CREATE TABLE IF NOT EXISTS `bookings`(" +
  "`booking_id` INT(11) PRIMARY KEY AUTO_INCREMENT," +
  "`cid` INT(11)," +
  "`booking_date` date NOT NULL," +
  "FOREIGN KEY (cid) REFERENCES customers(customer_id));",

  "CREATE TABLE IF NOT EXISTS `rooms`(" +
  "`room_id` INT(11) AUTO_INCREMENT," +
  "`is_clean` boolean NOT NULL," +
  "`is_occupied` boolean NOT NULL," +
  "PRIMARY KEY (`room_id`));",

  "CREATE TABLE IF NOT EXISTS `booking_details`(" +
  "`booking_details_id` INT(11) PRIMARY KEY AUTO_INCREMENT," +
  "`bid` INT(11)," +
  "`rid` INT(11)," +
  "`booking_price` INT NOT NULL," +
  "FOREIGN KEY (bid) REFERENCES customers(customer_id)," +
  "FOREIGN KEY (rid) REFERENCES rooms(room_id));"
  ];

  var deleteTables = [
  "DROP TABLE IF EXISTS `customers`",
  "DROP TABLE IF EXISTS `bookings`",
  "DROP TABLE IF EXISTS `rooms`",
  "DROP TABLE IF EXISTS `booking_details`"
  ];

  var insert = [
  "INSERT INTO `customers` (`email`, `first_name`, `last_name`, `age`) VALUES (\"boobroos@gmail.com\", \"Bob\", \"Ross\", 27)",
  "INSERT INTO `bookings` (`booking_date`) VALUES (\'1920-09-20\')",
  "INSERT INTO `rooms` (`is_clean`, `is_occupied`) VALUES (false, true)",
  "INSERT INTO `booking_details` (`booking_price`) VALUES (1)"
  ];


  if(!x) {
    for (i = 0; i < 4; i++) {
    //  mysql.pool.query(deleteTables[i], function(err){
    //    if(err){
    //      next(err);
    //      return;
    //    }
    //  });
      mysql.pool.query(createTables[i], function(err){
        if(err){
          next(err);
          return;
        }
      });
      mysql.pool.query(insert[i], function(err){
        if(err){
          next(err);
          return;
        }
      });
    };
  }
  x = 1;

  res.render('home');

app.get('/create-customer-account',function(req,res,next){
  var context = {};
    mysql.pool.query('SELECT * FROM `customers`', function(err, rows, fields){
      context.results = rows;
	  res.render('create-customer-account',context);
	  });
});

app.post('/create-customer-account', function(req, res, next){
  var context = {};
  var params  = req.body;
    mysql.pool.query('INSERT INTO customers SET ?', params, function(err, results, fields){
    mysql.pool.query('SELECT * FROM `customers`', function(err, rows, fields){
      context.results = rows;
	    res.render('create-customer-account',context);
	  });
  });
});


app.get('/search-customer',function(req,res,next){
  var context = {};
    mysql.pool.query('SELECT first_name, last_name, email, age FROM `customers`', function(err, rows, fields){
    context.results = rows;
	  res.render('search-customer',context);
	  });
});

app.get('/create-booking',function(req,res,next){
  var context = {};
    mysql.pool.query('SELECT * FROM `bookings`', function(err, rows, fields){
      context.results = rows;
	  res.render('create-booking',context);
	  });
});

app.post('/create-booking', function(req, res, next){
  var context = {};
  var params  = req.body;
    mysql.pool.query('INSERT INTO bookings SET ?', params, function(err, results, fields){
    mysql.pool.query('SELECT * FROM `bookings`', function(err, rows, fields){
      context.results = rows;
	    res.render('create-booking',context);
	  });
  });
});

app.get('/search-booking-details',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM `booking_details`', function(err, rows, fields){
    context.results = rows;
    res.render('search-booking-details',context);
  });
});

app.get('/search-existing-rooms',function(req,res,next){
  var context = {};
    mysql.pool.query('SELECT * FROM `rooms`', function(err, rows, fields){
      context.results = rows;
	  res.render('search-existing-rooms',context);
	  });
});

app.get('/add-new-rooms',function(req,res,next){
  var context = {};
    mysql.pool.query('SELECT * FROM `rooms`', function(err, rows, fields){
      context.results = rows;
	  res.render('add-new-rooms',context);
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
