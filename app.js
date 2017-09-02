// 모듈을 추출합니다.
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
//var morgan = require('morgan');

// 모듈로 분리한 설정 파일 불러오기
var config = require('./config');


// 데이터베이스와 연결합니다.
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


// 서버를 생성합니다.
var app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));

//app.use(morgan('combined'));

// 서버를 실행합니다.
app.listen(config.server_port, function () {
  console.log('server running at http://127.0.0.1:'+config.server_port);
});

// 라우트를 수행합니다.
app.get('/', function (request, response) {
  // 파일을 읽습니다.
  fs.readFile('list.html', 'utf8', function (error, data) {
    // 데이터베이스 쿼리를 실행합니다.
    client.query('SELECT * FROM books', function (error, results) {

	  if(error){
		console.log(error);
	  }

      // 응답합니다.
      response.send(ejs.render(data, {
        data: results
      }));
    });
  });
});

// 라우트를 수행합니다.
app.get('/books', function (request, response) {
    // 데이터베이스 쿼리를 실행합니다.
    client.query('SELECT * FROM books', function (error, results) {

	  if(error){
		console.log(error);
	  }

      // 응답합니다.
      response.send(results);
    });
});

app.get('/delete/:book_id', function (request, response) {
  // 데이터베이스 쿼리를 실행합니다.
  client.query('DELETE FROM books WHERE book_id=?', [request.params.book_id], function (error) {

	if(error){
      console.log(error);
	}

    // 응답합니다.
    response.redirect('/');
  });
});

app.get('/insert', function (request, response) {
  // 파일을 읽습니다.
  fs.readFile('insert.html', 'utf8', function (error, data) {

	if(error){
	  console.log(error);
	}

    // 응답합니다.
    response.send(data);
  });
});

app.post('/insert', function (request, response) {
  // 변수를 선언합니다.
  var body = request.body;
  // 데이터베이스 쿼리를 실행합니다.
  client.query('INSERT INTO books (isbn10, isbn13, title) VALUES (?, ?, ?)', [
      body.isbn10, body.isbn13, body.title
  ], function (error) {

	if(error){
	  console.log(error);
	}

    // 응답합니다.
    response.redirect('/');
  });
});

app.get('/edit/:book_id', function (request, response) {
  // 파일을 읽습니다.
  fs.readFile('edit.html', 'utf8', function (error, data) {

    if(error){
	  console.log(error);
    }

    // 데이터베이스 쿼리를 실행합니다.
    client.query('SELECT * FROM books WHERE book_id = ?', [
        request.params.book_id
    ], function (error, result) {

	  if(error){
		console.log(error);
	  }

      // 응답합니다.
      response.send(ejs.render(data, {
        data: result[0]
      }));
    });
  });
});

app.post('/edit/:book_id', function (request, response) {
  // 변수를 선언합니다.
  var body = request.body;
  // 데이터베이스 쿼리를 실행합니다.
  client.query('UPDATE books SET isbn10=?, isbn13=?, title=? WHERE book_id=?', [body.isbn10, body.isbn13, body.title, request.params.book_id], function (error) {

	if(error){
      console.log(error);
	}

    // 응답합니다.
    response.redirect('/');
  });
});
