/*
- mongoDB po wystartowaniu domyślnie działa na porcie 27017
- wcześniej za pomocą 
$mongosh
use wakacje_db
stworzono bazę danych wakacje_db i kolekcję todos
*/

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

const todos = require('./routes/todoRoutes.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/todos', todos);


// Start serwera
app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
