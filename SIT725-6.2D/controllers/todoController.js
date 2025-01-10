const { createTodo, getAllTodos, updateTodo, deleteTodo } = require("../models/todoModel");
const { ObjectId } = require("mongodb");

// for adding task in database
async function addTodo(req, res) {
  try {
    const { task } = req.body;
    await createTodo(task);
    const todos = await getAllTodos();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to add todo" });
  }
}

// for getting task from database
async function getTodos(req, res) {
  try {
    const todos = await getAllTodos();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve todos" });
  }
}

//for endpoint for editing task
async function editTodo(req, res) {
  try {
    const { id, task } = req.body;
    await updateTodo(id, task);
    const todos = await getAllTodos();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to edit todo" });
  }
}

//endpoint for removing task from database
async function removeTodo(req, res) {
  try {
    const { id } = req.params;
    await deleteTodo(id);
    const todos = await getAllTodos();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
}

//endpoint for adding bulk todos in database
async function addTodosBulk(req, res) {
  try {
    const todos = req.body;
    await Promise.all(todos.map((todo) => createTodo(todo.task)));
    const updatedTodos = await getAllTodos();
    res.status(200).json(updatedTodos);
  } catch (error) {
    res.status(500).json({ error: "Failed to add todos in bulk" });
  }
}

// endpoint for clearing all availble todos from database
async function clearAllTodos(req, res) {
  try {
    const db = require("../db").getDB();
    await db.collection("todos").deleteMany({}); // Deletes all todos
    res.status(200).json([]); // Return an empty array
  } catch (error) {
    res.status(500).json({ error: "Failed to clear todos" });
  }
}

//endpoint for getting todo's by their IDs
async function getTodoById(req, res) {
  try {
    const { id } = req.params;
    const db = require("../db").getDB();
    const todo = await db.collection("todos").findOne({ _id: new ObjectId(id) });
    if (todo) {
      res.status(200).json(todo);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid ID" });
  }
}

//exporting all endpoint
module.exports = {
  addTodo,
  getTodos,
  editTodo,
  removeTodo,
  addTodosBulk,
  clearAllTodos,
  getTodoById,
};
