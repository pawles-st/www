const express = require('express');
const app = express();
const port = 3002;

/* dane do renderowania strony */
const todolist = [
    { id: 1, text: "Wycieczka do Singapuru", done: true },
    { id: 2, text: "Rodzinne wczasy na Majorce", done: false },
    { id: 3, text: "Wspinaczka w Himalajach", done: false }
];
const user= "Anna";

app.set('view engine', 'ejs'); //ustawiamy ejs jako silnik szablonów
app.set('views', './views'); //ustawiamy katalog 'views' jako katalog z szablonami widoków 
app.use(express.static('public')); //udostępniamy statycznie dokument css


//odpowiedź na żądanie GET do zasobu /
app.get('/', (req, res) => {
  //renderowanie widoku list.ejs przy użyciu listy todolist
  res.render('list', { todolist, user });
});

//obsługa formularza metodą POST
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false }) // application/x-www-form-urlencoded

app.post('/todo', urlencodedParser, (req, res) => {
    let selectedActivities = req.body.activities;
    todolist.forEach(todo => {
        if (selectedActivities.includes(todo.text)) {
          todo.done = true;
        } else {
          todo.done = false;
        }
        console.log(todolist);
    });
    res.redirect('/');  //przekierowanie na stronę główną
});
    

app.listen(port, () => {
  console.log(`Serwer nasłuchuje na porcie ${port}`);
});
