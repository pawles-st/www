/*
- mongoDB po wystartowaniu domyślnie działa na porcie 27017
- wcześniej za pomocą 
$mongosh
use wakacje_db
stworzono bazę danych wakacje_db i kolekcję todos
*/

/*ładujemy model danych dla todos z modułu ./models/todos.js*/
const Todo = require('./models/todos.js');

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
const app = express();
const port = 3011;

const user= "Anna";

app.set('view engine', 'ejs'); //ustawiamy ejs jako silnik szablonów
app.set('views', './views'); //ustawiamy katalog 'views' jako katalog z szablonami widoków 
app.use(express.static('public')); //udostępniamy statycznie dokument css

// endpoint /  -- Renderowanie widoku list.ejs na podstawie danych z bazy
app.get('/', (req, res) => {
  Todo.find()
    .then(todolist => {
      res.render('list', { user, todolist });
    })
    .catch(error => {
      console.error('Błąd odczytu danych z bazy danych:', error);
      res.render('list', { user: user, todolist: [] });
    });
});

// Start serwera
app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});

//obsługa formularza metodą POST
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false }) // application/x-www-form-urlencoded

app.post('/todo', urlencodedParser, (req, res) => {
  const selectedActivities = req.body.activities;
  Todo.updateMany({}, {done: false})
  .then( () => {
    Todo.updateMany({ text: { $in: selectedActivities } }, { done: true })
      .then(() => {
        console.log('Zaktualizowano zaznaczenia checkboxów.');
        res.redirect('/');
    })
  })
  .catch(error => {
      console.error('Błąd aktualizacji danych:', error);
      res.status(500).send('Wystąpił błąd podczas aktualizacji danych.');
    });      
});
