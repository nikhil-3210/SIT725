const { getDB } = require("../db");
const { ObjectId } = require("mongodb");

async function createTodo(task) {
  const db = getDB();
  const collection = db.collection("todos");
  const result = await collection.insertOne({ task });
  return result;
}

async function getAllTodos() {
  const db = getDB();
  const collection = db.collection("todos");
  const todos = await collection.find().sort({ _id: 1 }).toArray(); // Ensure sorting by _id
  return todos;
}

async function updateTodo(id, task) {
  const db = getDB();
  const collection = db.collection("todos");
  return await collection.updateOne({ _id: new ObjectId(id) }, { $set: { task } });
}

async function deleteTodo(id) {
  const db = getDB();
  const collection = db.collection("todos");
  return await collection.deleteOne({ _id: new ObjectId(id) });
}

module.exports = { createTodo, getAllTodos, updateTodo, deleteTodo };
