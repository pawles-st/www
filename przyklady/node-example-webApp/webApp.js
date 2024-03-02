/*
- mongoDB po wystartowaniu domyślnie działa na porcie 27017
- wcześniej za pomocą 
$mongosh
use wakacje_db
stworzono bazę danych wakacje_db i kolekcję todos
*/

/*ładujemy model danych dla todos z modułu ./models/todos.js*/
//const Todo = require('./models/todos.js');

/*Połączenie z bazą danych */
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost:27017/wakacje_db')
    .then(() => {
        console.log('Połączono z bazą danych');      
    })
    .catch(error => {
        console.error('Błąd połączenia z bazą danych:', error);
  });

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3005;

app.set('view engine', 'ejs'); //ustawiamy ejs jako silnik szablonów
app.set('views', './views'); //ustawiamy katalog 'views' jako katalog z szablonami widoków 
app.use(express.static('public')); //udostępniamy statycznie dokument css


const todos = require('./routes/todoRoutes.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/todos', todos);

const http = require('http');

app.get('/', (req, res) => {
  const options = {
    hostname: 'localhost',
    port: 3005,
    path: '/todos',
    method: 'GET'
  };

  const request = http.request(options, response => {
    let responseData = '';

    response.on('data', chunk => {
      responseData += chunk;
    });

    response.on('end', () => {
      const data = JSON.parse(responseData);
      res.render('list', {data});
      console.log(data);
    });
  });

  request.on('error', error => {
    console.error('Błąd pobierania danych z REST API:', error);
    res.status(500).json({ message: 'Wystąpił błąd w serwerze.' });
  });

  request.end();
});

// Start serwera
app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
