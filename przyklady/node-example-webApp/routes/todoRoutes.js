/*Uwaga: Obsługę operacji na bazie danych wypadałoby przenieśc do odpowiednich kontrolerów */
const express = require('express');
const router = express.Router();
const Todo = require('../models/todos.js');

//pobiera całą kolekcję todos
router.get('/', function(req, res){
    Todo.find()
    .then(todolist => {
      console.log(todolist);
      res.status(200);
      res.json(todolist);
    })
    .catch(error => {
      res.status(500);
      res.json({message: 'Błąd odczytu danych z bazy danych:'});
      console.error('Błąd odczytu danych z bazy danych:', error);
    });
 });

 //dodaje nową pozycję do listy todos
 router.post('/', function(req, res) {
  let newTodo = new Todo(req.body);
  if(typeof newTodo.id == undefined || typeof newTodo.text==undefined || typeof newTodo.done == undefined ){
    res.status(400);
    res.json({message: 'Błędne żądanie'});
  } else {
    newTodo.save()
    .then(todoItem => {
      console.log(todoItem);
      res.status(201);
      res.json(todoItem);
    })
    .catch(error => {
      res.status(500);
      res.json({message: 'Błąd zapisu danych do bazy danych'});
      console.error('Błąd zapisu danych do bazy: ', error);
    });
 }
});

//aktualizuje pozycję w liscie po id
router.put('/:id', function(req, res) {
   Todo.findByIdAndUpdate(req.params.id, req.body)
  .then(() => {
      console.log('Update udany id'+req.params.id);
      res.status(200);
      res.json({message: 'Update udany'});
  })
  .catch(error => {
    res.status(500);
    res.json({message: 'Błąd akutalizacji danych w bazie'});
    console.error('Błąd aktualizacji danych w bazie: ', error);
  });
});

module.exports = router; //eksport routera używanego przez API