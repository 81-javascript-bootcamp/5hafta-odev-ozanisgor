import { getDataFromApi, addTaskToApi, removeTaskFromApi } from './data';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$addTaskBtn = this.$taskForm.querySelector('button');
  }

  addTask(task) {
    this.$addTaskBtn.innerText = 'Loading...';
    this.$addTaskBtn.disabled = true;
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        this.$addTaskBtn.innerText = 'Add Task';
        this.$addTaskBtn.disabled = false;
      });
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.innerHTML = `<th scope="row">${task.id}</th><td>${task.title}</td><span id=${task.id} class='remove-span'><i
    class="fas fa-backspace"
  ></i></span>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
    });
  }

  handleRemoveTask() {
    getDataFromApi().then(() => {
      const $removeSpans = this.$tableTbody.querySelectorAll('.remove-span');
      console.log($removeSpans);
      $removeSpans.forEach((span) => {
        span.addEventListener('click', (e) => {
          console.log(e);
          span.parentElement.remove();
          removeTaskFromApi(span.id);
        });
      });
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
    this.handleRemoveTask();
  }
}

export default PomodoroApp;
