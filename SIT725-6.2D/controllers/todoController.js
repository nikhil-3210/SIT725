const { createTodo, getAllTodos, updateTodo, deleteTodo } = require('../models/todoModel');

async function addTodo(req, res) {
  const { task } = req.body;
  await createTodo(task);
  const todos = await getAllTodos();
  res.json(todos); // Return updated todos
}

async function getTodos(req, res) {
  const todos = await getAllTodos();
  res.json(todos);
}

async function editTodo(req, res) {
  const { id, task } = req.body;
  await updateTodo(id, task);
  const todos = await getAllTodos();
  res.json(todos);
}

async function removeTodo(req, res) {
  const { id } = req.params;
  await deleteTodo(id);
  const todos = await getAllTodos();
  res.json(todos);
}

module.exports = { addTodo, getTodos, editTodo, removeTodo };
