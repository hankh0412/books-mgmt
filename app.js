// ����� �����մϴ�.
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
//var morgan = require('morgan');

// ���� �и��� ���� ���� �ҷ�����
var config = require('./config');


// �����ͺ��̽��� �����մϴ�.
var client = mysql.createConnection({
  host     : config.db_host,
  user: config.db_user,
  password: config.db_password,
  database: config.db_name
});

client.connect(function(err) { 
  if(err) { 
    console.error('mysql connection error'); 
	console.error(err); 
	throw err; 
  } else { 
    console.log("mysql connection success"); 
  } 
});


// ������ �����մϴ�.
var app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));

//app.use(morgan('combined'));

// ������ �����մϴ�.
app.listen(config.server_port, function () {
  console.log('server running at http://127.0.0.1:'+config.server_port);
});

// ���Ʈ�� �����մϴ�.
app.get('/', function (request, response) {
  // ������ �н��ϴ�.
  fs.readFile('list.html', 'utf8', function (error, data) {
    // �����ͺ��̽� ������ �����մϴ�.
    client.query('SELECT * FROM books', function (error, results) {
	  
	  if(error){
		console.log(error);
	  }
	  
      // �����մϴ�.
      response.send(ejs.render(data, {
        data: results
      }));
    });
  });
});

app.get('/delete/:book_id', function (request, response) {
  // �����ͺ��̽� ������ �����մϴ�.
  client.query('DELETE FROM books WHERE book_id=?', [request.params.book_id], function (error) {
	
	if(error){
      console.log(error);
	}
	
    // �����մϴ�.
    response.redirect('/');
  });
});

app.get('/insert', function (request, response) {
  // ������ �н��ϴ�.
  fs.readFile('insert.html', 'utf8', function (error, data) {
	
	if(error){
	  console.log(error);
	}
	
    // �����մϴ�.
    response.send(data);
  });
});

app.post('/insert', function (request, response) {
  // ������ �����մϴ�.
  var body = request.body;
  // �����ͺ��̽� ������ �����մϴ�.
  client.query('INSERT INTO books (isbn10, isbn13, title) VALUES (?, ?, ?)', [
      body.isbn10, body.isbn13, body.title
  ], function (error) {
	
	if(error){
	  console.log(error);
	}
	  
    // �����մϴ�.
    response.redirect('/');
  });
});

app.get('/edit/:book_id', function (request, response) {
  // ������ �н��ϴ�.
  fs.readFile('edit.html', 'utf8', function (error, data) {
	
    if(error){
	  console.log(error);
    }	
	
    // �����ͺ��̽� ������ �����մϴ�.
    client.query('SELECT * FROM books WHERE book_id = ?', [
        request.params.book_id
    ], function (error, result) {
	
	  if(error){
		console.log(error);
	  }
		
      // �����մϴ�.
      response.send(ejs.render(data, {
        data: result[0]
      }));
    });
  });
});

app.post('/edit/:book_id', function (request, response) {
  // ������ �����մϴ�.
  var body = request.body;
  // �����ͺ��̽� ������ �����մϴ�.
  client.query('UPDATE books SET isbn10=?, isbn13=?, title=? WHERE book_id=?', [body.isbn10, body.isbn13, body.title, request.params.book_id], function (error) {
	
	if(error){
      console.log(error);
	}
	  
    // �����մϴ�.
    response.redirect('/');
  });
});