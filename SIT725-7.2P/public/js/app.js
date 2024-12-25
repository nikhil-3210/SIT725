document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.getElementById('task-list');
  const newTaskInput = document.getElementById('new-task');
  const addTaskButton = document.getElementById('add-task');
  const socket = io(); // Connecting to the socket server

  // Fetching and display todos task
  function fetchTodos() {
    fetch('/todos')
      .then((response) => response.json())
      .then((todos) => {
        updateTaskList(todos);
      });
  }

  // Updating task list in the DOM
  function updateTaskList(todos) {
    taskList.innerHTML = ''; // Clearing the list
    todos.forEach((todo) => {
      const li = document.createElement('li');
      li.setAttribute('data-id', todo._id);
      li.innerHTML = `
        ${todo.task}
        <button class="edit-btn btn small waves-effect waves-light">Edit</button>
        <button class="delete-btn btn small red waves-effect waves-light">Delete</button>
      `;
      taskList.appendChild(li);

      // Adding event listeners for Editing and Deleting
      li.querySelector('.edit-btn').addEventListener('click', () => {
        const updatedTask = prompt('Edit task:', todo.task);
        if (updatedTask) {
          updateTodo(todo._id, updatedTask);
        }
      });

      li.querySelector('.delete-btn').addEventListener('click', () => {
        deleteTodo(todo._id);
      });
    });
  }

  // Adding a new todo task
  function addTodo() {
    const task = newTaskInput.value.trim();
    if (task) {
      fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      }).then(() => {
        newTaskInput.value = ''; // Clearing input field after adding
      });
    }
  }

  // Updating an existing todo on User interface
  function updateTodo(id, task) {
    fetch('/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, task }),
    });
  }

  // Deleting a todo from todo list
  function deleteTodo(id) {
    fetch(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  // Listening for real-time updates
  socket.on('updateTodos', (todos) => {
    updateTaskList(todos);
  });

  // Adding task button event listener
  addTaskButton.addEventListener('click', addTodo);

  // Fetching initial todos on page load after every page load or refresh page
  fetchTodos();
});