const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017'; // MongoDB connection URL
const dbName = 'todoApp'; // Database name
let db;

async function connectDB() {
  const client = new MongoClient(url);
  await client.connect();
  db = client.db(dbName); // Get the database
  console.log('Connected to MongoDB');
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };
