const todoInputDOM = document.getElementById('todoInput');
const addBtnDOM = document.getElementById('addBtn');
const toDoListDOM = document.getElementById('toDoList');

let todoList = [];

function addToDoItem() {
  const inputValue = todoInputDOM.value;

  if (!inputValue.trim()) {
    return alert('Todo Input Boş Olamaz!');
  }

  if (todoList.includes(inputValue)) {
    return alert('Aynı Todo Olmamalı!');
  }

  // todoList.push(inputValue);
  todoList = [...todoList, inputValue];
  displayToDoUI(todoList);
  todoInputDOM.value = '';
}

function removeToDoItem(index) {
  todoList = todoList.filter((_, todoIndex) => index !== todoIndex);
  displayToDoUI(todoList);
}

function displayToDoUI(todoListArray) {
  if (!todoList.length) {
    toDoListDOM.innerHTML = `<strong>Hiç ToDo Eklenmedi</strong>`;
    return;
  }

  let li = '';
  todoListArray.forEach((todo, index) => {
    
    li += `<li>
          <strong>${todo} index: ${index}</strong>
          <button onclick="removeToDoItem(${index})">Sil</button>
        </li>`;

    
  });
  toDoListDOM.innerHTML = li;
}

addBtnDOM.addEventListener('click', addToDoItem);
document.addEventListener('DOMContentLoaded', displayToDoUI);
