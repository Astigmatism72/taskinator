var formE1 = document.querySelector("#save-task");
var tasksToDoE1 = document.querySelector("#tasks-to-do");

var createTaskHandler = function () {
  event.preventDefault();

  var listItemE1 = document.createElement("li");
  listItemE1.className = "task-item";
  listItemE1.textContent = "This is a new task.";
  tasksToDoE1.appendChild(listItemE1);
};

formE1.addEventListener("click", createTaskHandler);
