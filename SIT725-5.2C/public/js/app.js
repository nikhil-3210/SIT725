// public/js/app.js
document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.getElementById('task-list');
  const newTaskInput = document.getElementById('new-task');
  const addTaskButton = document.getElementById('add-task');

  function fetchTodos() {
    fetch('/todos')
      .then(response => response.json())
      .then(todos => {
        taskList.innerHTML = ''; // Clear the list
        todos.forEach(todo => {
          const li = document.createElement('li');
          li.setAttribute('data-id', todo._id); // Store the task's ID
          li.innerHTML = `
            ${todo.task}
            <button class="edit-btn btn small waves-effect waves-light">Edit</button>
            <button class="delete-btn btn small red waves-effect waves-light">Delete</button>
          `;
          taskList.appendChild(li);

          // Add Edit button event
          li.querySelector('.edit-btn').addEventListener('click', () => {
            const updatedTask = prompt('Edit task:', todo.task);
            if (updatedTask) {
              updateTodo(todo._id, updatedTask);
            }
          });

          // Add Delete button event
          li.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTodo(todo._id);
          });
        });
      });
  }

  function addTodo() {
    const task = newTaskInput.value;
    if (task) {
      fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
      })
      .then(() => {
        newTaskInput.value = ''; // Clear the input field
        fetchTodos(); // Fetch updated task list
      });
    }
  }

  function updateTodo(id, task) {
    fetch('/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, task })
    })
    .then(() => fetchTodos());
  }

  function deleteTodo(id) {
    fetch(`/todos/${id}`, {
      method: 'DELETE'
    })
    .then(() => fetchTodos());
  }

  // Event listeners
  addTaskButton.addEventListener('click', addTodo);

  // Fetch todos on page load
  fetchTodos();
});
