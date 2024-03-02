const mongoose = require('mongoose');
//schemat
const todoSchema = new mongoose.Schema({
    id: Number,
    text: String,
    done: Boolean
  });
//model
const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;  //eksport modułu