const todos = [];
const RENDER_EVENT = "render-todo";

document.addEventListener("DOMContentLoaded", function () {
	const submitForm = document.getElementById("form");
	submitForm.addEventListener("submit", function (event) {
		event.preventDefault();
		addTodo();
	});

	function generateTodoObject(id, task, timestamp, isCompleted) {
		return {
			id,
			task,
			timestamp,
			isCompleted,
		};
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

		document.dispatchEvent(new Event(RENDER_EVENT));
	}

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

		return container;
	}

	document.addEventListener(RENDER_EVENT, function () {
		console.log(todos);
		const uncompletedTODOList = document.getElementById("todos");
		uncompletedTODOList.innerHTML = "";

		for (const todoItem of todos) {
			const todoElement = makeTodo(todoItem);
			uncompletedTODOList.append(todoElement);
		}
	});
});
