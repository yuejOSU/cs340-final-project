var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.get('/',function(req,res,next){
  var context = {};
  var createString = "CREATE TABLE IF NOT EXISTS `customer`(" +
  "`customer_id` INT PRIMARY KEY AUTO_INCREMENT," +
  "`first_name` VARCHAR(255) NOT NULL," +
  "`last_name` VARCHAR(255) NOT NULL," +
  "`email` VARCHAR(255) NOT NULL)";
  mysql.pool.query('DROP TABLE IF EXISTS `customer`', function(err){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query(createString, function(err){
      if(err){
        next(err);
		return;
      }
	  mysql.pool.query('INSERT INTO `customer` (`first_name`, `last_name`, `email`) VALUES ("Bob", "Ross", "boobroos@gmail.com")',function(err){
	    mysql.pool.query('SELECT * FROM `customer`', function(err, rows, fields){
		  context.results = JSON.stringify(rows);
		  res.render('home',context);
		});
	  });
    });
  });
});

app.get('/create-customer-account',function(req,res,next){
  var context = {};
    mysql.pool.query('SELECT * FROM `customer`', function(err, rows, fields){
	  context.results = JSON.stringify(rows);
	  res.render('create-customer-account',context);
	  });
});

app.get('/search-customer',function(req,res,next){
  var context = {};
    mysql.pool.query('SELECT * FROM `customer`', function(err, rows, fields){
	  context.results = JSON.stringify(rows);
	  res.render('search-customer',context);
	  });
});

app.get('/create-booking',function(req,res,next){
  var context = {};
    mysql.pool.query('SELECT * FROM `customer`', function(err, rows, fields){
	  context.results = JSON.stringify(rows);
	  res.render('create-booking',context);
	  });
});

app.get('/search-existing-rooms',function(req,res,next){
  var context = {};
    mysql.pool.query('SELECT * FROM `customer`', function(err, rows, fields){
	  context.results = JSON.stringify(rows);
	  res.render('search-existing-rooms',context);
	  });
});

app.get('/add-new-rooms',function(req,res,next){
  var context = {};
    mysql.pool.query('SELECT * FROM `customer`', function(err, rows, fields){
	  context.results = JSON.stringify(rows);
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
