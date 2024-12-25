const { createTodo, getAllTodos, updateTodo, deleteTodo } = require('../models/todoModel');

async function addTodo(req, res) {
  const { task } = req.body;
  if (!task || typeof task !== 'string') {
    return res.status(400).json({ error: 'Task is required and must be a string' });
  }

  await createTodo(task);
  const todos = await getAllTodos();
  req.app.locals.broadcast(todos); // Broadcasting to all the connected clients
  res.json(todos); // Returning updated todos task to all the connected clients
}

async function getTodos(req, res) {
  const todos = await getAllTodos();
  res.json(todos);
}

async function editTodo(req, res) {
  const { id, task } = req.body;
  if (!id || !task || typeof task !== 'string') {
    return res.status(400).json({ error: 'Invalid ID or Task' });
  }

  await updateTodo(id, task);
  const todos = await getAllTodos();
  req.app.locals.broadcast(todos); // Broadcasting to updates to all the connected client
  res.json(todos);
}

async function removeTodo(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  await deleteTodo(id);
  const todos = await getAllTodos();
  req.app.locals.broadcast(todos); // Broadcasting to clients
  res.json(todos);
}

module.exports = { addTodo, getTodos, editTodo, removeTodo };