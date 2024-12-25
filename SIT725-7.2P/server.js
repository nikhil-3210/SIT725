const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./db');
const todoController = require('./controllers/todoController');
const http = require('http'); // Required for Socket.IO
const socketIo = require('socket.io'); // Import Socket.IO

const app = express();
const server = http.createServer(app); // Create server for Socket.IO
const io = socketIo(server); // Initializ Socket.IO with the server

const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // for serving static files from the 'public' folder

// Connecting to MongoDB
connectDB();

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  // Broadcast updates
  app.locals.broadcast = (todos) => {
    io.emit('updateTodos', todos); // Emit updated todos list
  };
});

// Routes
app.get('/todos', todoController.getTodos);
app.post('/todos', todoController.addTodo);
app.put('/todos', todoController.editTodo);
app.delete('/todos/:id', todoController.removeTodo);

// Serving the index.html when accessing the root
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app; // Exporting the Express app