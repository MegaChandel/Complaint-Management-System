// Select DOM elements
const newTaskInput = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const pendingCount = document.getElementById('pending-count');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task
addTaskButton.addEventListener('click', () => {
  const taskName = newTaskInput.value.trim();
  if (taskName) {
    addTask(taskName);
    saveTasks();
    newTaskInput.value = ''; // Clear input
  }
});

// Add task to the DOM
function addTask(name, completed = false) {
  const li = document.createElement('li');
  li.className = `task-item ${completed ? 'completed' : ''}`;
  li.innerHTML = `
    <span>${name}</span>
    <div class="task-actions">
      <button onclick="toggleComplete(this)">✔</button>
      <button onclick="editTask(this)">✎</button>
      <button onclick="deleteTask(this)">✖</button>
    </div>
  `;
  taskList.appendChild(li);
  updatePendingCount();
}

// Toggle task completion
function toggleComplete(button) {
  const task = button.parentElement.parentElement;
  task.classList.toggle('completed');
  saveTasks();
  updatePendingCount();
}

// Edit task
function editTask(button) {
  const task = button.parentElement.parentElement;
  const taskName = prompt('Edit Task', task.children[0].textContent);
  if (taskName !== null) {
    task.children[0].textContent = taskName.trim();
    saveTasks();
  }
}

// Delete task
function deleteTask(button) {
  const task = button.parentElement.parentElement;
  task.remove();
  saveTasks();
  updatePendingCount();
}

// Update pending tasks count
function updatePendingCount() {
  const pendingTasks = [...taskList.children].filter(
    (task) => !task.classList.contains('completed')
  ).length;
  pendingCount.textContent = `Pending Tasks: ${pendingTasks}`;
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = [...taskList.children].map((task) => ({
    name: task.children[0].textContent,
    completed: task.classList.contains('completed'),
  }));
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach((task) => addTask(task.name, task.completed));
}
