const todos = [];
const RENDER_EVENT = "render-todo";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

function isStorageExist() {
	if (typeof Storage === undefined) {
		alert("Browser Kamu Tidak Mendukung Web Storage");
		return false;
	}
	return true;
}

function loadDataFromStorage() {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	const data = JSON.parse(serializedData);

	if (data !== null) {
		for (const todo of data) {
			todos.push(todo);
		}
	}
	document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
	const submitForm = document.getElementById("form");
	submitForm.addEventListener("submit", function (event) {
		event.preventDefault();
		addTodo();
	});

	function makeTodo(todoObject) {
		const textTitle = document.createElement("h2");
		textTitle.innerText = todoObject.task;

		const textTimestamp = document.createElement("p");
		textTimestamp.innerText = todoObject.timestamp;

		const textContainer = document.createElement("div");
		textContainer.classList.add("inner");
		textContainer.append(textTitle, textTimestamp);

		const container = document.createElement("div");
		container.classList.add("item", "shadow");
		container.append(textContainer);
		container.setAttribute("id", `todo-${todoObject.id}`);

		if (todoObject.isCompleted) {
			const undoButton = document.createElement("button");
			undoButton.classList.add("undo-button");

			undoButton.addEventListener("click", function () {
				undoTaskFromCompleted(todoObject.id);
			});

			const trashButton = document.createElement("button");
			trashButton.classList.add("trash-button");

			trashButton.addEventListener("click", function () {
				removeTaskFromCompleted(todoObject.id);
			});

			container.append(undoButton, trashButton);
		} else {
			const checkButton = document.createElement("button");
			checkButton.classList.add("check-button");

			checkButton.addEventListener("click", function () {
				addTaskToCompleted(todoObject.id);
			});

			container.append(checkButton);
		}

		return container;
	}

	function findTodo(todoId) {
		for (const todoItem of todos) {
			if (todoItem.id === todoId) {
				return todoItem;
			}
		}
		return null;
	}

	function findTodoIndex(todoId) {
		for (const index in todos) {
			if (todos[index].id == todoId) {
				return index;
			}
		}
	}

	function addTodo() {
		const textTodo = document.getElementById("title").value;
		const timeStamp = document.getElementById("date").value;

		const generatedID = generateID();
		const todoObject = generateTodoObject(generatedID, textTodo, timeStamp, false);
		todos.push(todoObject);

		function generateID() {
			return +new Date();
		}

		function generateTodoObject(id, task, timestamp, isCompleted) {
			return {
				id,
				task,
				timestamp,
				isCompleted,
			};
		}

		document.dispatchEvent(new Event(RENDER_EVENT));
		saveData();
	}

	function addTaskToCompleted(todoId) {
		const todoTarget = findTodo(todoId);

		if (todoTarget == null) return;
		todoTarget.isCompleted = true;
		document.dispatchEvent(new Event(RENDER_EVENT));
		saveData();
	}

	function removeTaskFromCompleted(todoId) {
		const todoTarget = findTodoIndex(todoId);
		if (todoTarget === -1) return;
		todos.splice(todoTarget, 1);
		document.dispatchEvent(new Event(RENDER_EVENT));
		saveData();
	}

	function undoTaskFromCompleted(todoId) {
		const todoTarget = findTodo(todoId);
		if (todoTarget == null) return;
		todoTarget.isCompleted = false;
		document.dispatchEvent(new Event(RENDER_EVENT));
		saveData();
	}

	document.addEventListener(RENDER_EVENT, function () {
		console.log(todos);
		const uncompletedTODOList = document.getElementById("todos");
		uncompletedTODOList.innerHTML = "";

		const completedTODOList = document.getElementById("completed-todos");
		completedTODOList.innerHTML = "";

		for (const todoItem of todos) {
			const todoElement = makeTodo(todoItem);
			if (!todoItem.isCompleted) {
				uncompletedTODOList.append(todoElement);
			} else {
				completedTODOList.append(todoElement);
			}
		}
	});

	function saveData() {
		if (isStorageExist()) {
			const parsed = JSON.stringify(todos);
			localStorage.setItem(STORAGE_KEY, parsed);
			document.dispatchEvent(new Event(SAVED_EVENT));
		}
	}

	document.addEventListener(SAVED_EVENT, function () {
		console.log(localStorage.getItem(STORAGE_KEY));
	});

	if (isStorageExist()) {
		loadDataFromStorage();
	}
});
