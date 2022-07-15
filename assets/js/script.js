var taskIdCounter = 0;

var formE1 = document.querySelector("#task-form");
var tasksToDoE1 = document.querySelector("#tasks-to-do");
var pageContentE1 = document.querySelector("#page-content");
var tasksInProgressE1 = document.querySelector("#tasks-in-progress");
var tasksCompletedE1 = document.querySelector("#tasks-completed");

// create array to hold tassks for saving
var tasks = [];

var taskFormHandler = function (event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check if inputs are empty (validate)
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  // reset form fields for next t ask to be entered
  document.querySelector(("input[name='task-name']".value = ""));
  document.querySelector("select[name='task-type']").selectedIndex = 0;

  // check if task is new or one being edited by seeingg if it has a data-task-id attribute
  var isEdit = formE1.hasAttribute("data-task-id");

  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formE1.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }

  // no data attribute, so create objrct as normal and pass to createTaskE1 function
  else {
    //   package up data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do",
    };
  }

  // send it as an argument to createTaskE1
  createTaskE1(taskDataObj);
};

var createTaskE1 = function (taskDataObj) {
  //   create list item
  var listItemE1 = document.createElement("li");
  listItemE1.className = "task-item";

  // add task id as a custom attribute
  listItemE1.setAttribute("data-task-id", taskIdCounter);

  //   create div to hold task info and add to list item
  var taskInfoE1 = document.createElement("div");
  taskInfoE1.className = "task-info";
  taskInfoE1.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class ='task-type'>" +
    taskDataObj.type +
    "</span>";

  listItemE1.appendChild(taskInfoE1);

  var taskActionsE1 = createTaskActions(taskIdCounter);
  listItemE1.appendChild(taskActionsE1);

  switch (taskDataObj.status) {
    case "to do":
      taskActionsE1.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 0;
      tasksToDoE1.append(listItemE1);
      break;
    case "in progress":
      taskActionsE1.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 1;
      tasksInProgressE1.append(listItemE1);
      break;
    case "completed":
      taskActionsE1.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 2;
      tasksCompletedE1.append(listItemE1);
      break;
    default:
      console.log("Something went wrong!");
  }

  // save task as an object with name, type, status, and id properties, then push it into tasks array
  taskDataObj = taskIdCounter;

  tasks.push(taskDataObj);

  // save tasks to localStorage
  saveTasks();

  // increase task counter for next unique id
  taskIdCounter++;
};

var createTaskActions = function (taskId) {
  var actionContainerE1 = document.createElement("div");
  actionContainerE1.className = "task-actions";

  // create edit button
  var editButtonE1 = document.createElement("button");
  editButtonE1.textContent = "Edit";
  editButtonE1.className = "btn edit-btn";
  editButtonE1.setAttribute("data-task-id", taskId);

  actionContainerE1.appendChild(editButtonE1);

  // create delete button
  var deleteButtonE1 = document.createElement("button");
  deleteButtonE1.textContent = "Delete";
  deleteButtonE1.className = "btn delete-btn";
  deleteButtonE1.setAttribute("data-task-id", taskId);

  actionContainerE1.appendChild(deleteButtonE1);

  var statusSelectE1 = document.createElement("select");
  statusSelectE1.setAttribute("name", "status-change");
  statusSelectE1.setAttribute("data-task-id", taskId);
  statusSelectE1.className = "select-status";
  actionContainerE1.appendChild(statusSelectE1);

  // create status options
  var statusChoices = ["To Do", "In Progress", "Completed"];

  for (var i = 0; i < statusChoices.length; i++) {
    // create option element
    var statusOptionE1 = document.createElement("option");
    statusOptionE1.textContent = statusChoices[i];
    statusOptionE1.setAttribute("value", statusChoices[i]);

    // append to select
    statusSelectE1.appendChild(statusOptionE1);
  }

  return actionContainerE1;
};

var completeEditTask = function (taskName, taskType, taskId) {
  // find the matching task list item (task list item with taskId value)
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  // loop through tasks array and task object with nnew content
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }

  alert("Task Updated!");

  // remove data attribute from form
  formE1.removeAttribute("data-task-id");
  // uupdate formE1 button to go back to saying "add Task" instead of "Edit Task"
  formE1.querySelector("#save-task").textContent = "Add Task";
  // save tasks to localStorage
  saveTasks();
};

var taskButtonHandler = function (event) {
  // get target element from event
  var targetE1 = event.target;

  // edit button was clicked
  if (targetE1.matches(".edit-btn")) {
    console.log("edit", targetE1);
    var taskId = targetE1.getAttribute("data-task-id");
    editTask(taskId);
  }

  // delete button was clicked
  else if (targetE1.matches(".delete-btn")) {
    console.log("delete", targetE1);
    // get the element's task id
    var taskId = targetE1.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var taskStatusChangeHandler = function (event) {
  console.log(event.target.value);

  // find task list item based on event.target's data-task-id attribute
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  if (statusValue === "to do") {
    tasksToDoE1.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressE1.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedE1.appendChild(taskSelected);
  }

  // update task in tasks[] array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }

  // save to localStorage
  saveTasks();
};

var editTask = function (taskId) {
  console.log(taskId);

  // get task list item element
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  console.log(taskName);

  var taskType = taskSelected.querySelector("span.task-type").textContent;
  console.log(taskType);

  // write values of taskName and taskType to form to be edited
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  // set data attribute to the form with a vlaue of the tas's id so it knows which one is being edited
  formE1.setAttribute("data-task-id", taskId);
  // update form's button to reflect editing a task rather than creating a new one
  formE1.querySelector("save-task").textContent = "Save Task";
};

var deleteTask = function (taskId) {
  console.log(taskId);

  // find task list element with taskId value and remove it
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();

  // create new array to hold updated list of tasks
  var updatedTaskArr = [];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }
  // reassign tasks array to be the same as updated TaskArr
  tasks = updatedTaskArr;
  saveTasks();
};

var saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function () {
  var savedTasks = localStorage.getItem("tasks");
  // if there are no tasks, set tasks to an empty array and return out of the function
  if (!savedTasks) {
    return false;
  }
  console.log("Saved tasks found!");
  // else, load up saved tasks

  // parse into array of objects
  savedTasks = JSON.parse(savedTasks);

  // loop through savedTasks array
  for (var i = 0; i < savedTasks.length; i++) {
    // pass each task object into the `createTaskE1()` function
    createTaskE1(savedTasks[i]);
  }
};

// Create a new task
formE1.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentE1.addEventListener("click", taskButtonHandler);

// for changing the status
pageContentE1.addEventListener("change", taskStatusChangeHandler);

loadTasks();
