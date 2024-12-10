// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./db');
const todoController = require('./controllers/todoController');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' folder

// Connect to MongoDB
connectDB();

// Routes
app.get('/todos', todoController.getTodos);
app.post('/todos', todoController.addTodo);
app.put('/todos', todoController.editTodo);
app.delete('/todos/:id', todoController.removeTodo);

// Serve the index.html when accessing the root
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
