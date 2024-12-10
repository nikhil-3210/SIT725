// models/todoModel.js
const { getDB } = require('../db');
const { ObjectId } = require('mongodb'); // Import ObjectId

async function createTodo(task) {
  const db = getDB();
  const collection = db.collection('todos');
  const result = await collection.insertOne({ task });
  return result;
}

async function getAllTodos() {
  const db = getDB();
  const collection = db.collection('todos');
  const todos = await collection.find().toArray();
  return todos;
}

async function updateTodo(id, task) {
  const db = getDB();
  const collection = db.collection('todos');
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: { task } });
}

async function deleteTodo(id) {
  const db = getDB();
  const collection = db.collection('todos');
  await collection.deleteOne({ _id: new ObjectId(id) });
}

module.exports = { createTodo, getAllTodos, updateTodo, deleteTodo };
