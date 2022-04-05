//html defaults
const elForm = document.querySelector("#main-form");
const elInput = document.querySelector("#main-input");
const elWrapper = document.querySelector("#main-wrapper");

const elAllBtn = document.querySelector("#all-btn");
const elAllCount = document.querySelector("#all-text");
const elUnompletedBtn = document.querySelector("#uncompleted-btn");
const elUnompletedCount = document.querySelector("#uncompleted-text");
const elCompletedBtn = document.querySelector("#completed-btn");
const elCompletedCount = document.querySelector("#completed-text");
const elControl = document.querySelector("#main-control");
const elTemplate = document.querySelector("#todo-template").content;

let storage = window.localStorage
let localTodoArray = JSON.parse(storage.getItem("todoArray"))
let localCounter = JSON.parse(storage.getItem("todoCounter"))


// 
let todosArray = localTodoArray || []

let counter = localCounter || 1



elForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    
    let todoInput = elInput.value.trim()
    
    if (todoInput) {
        let oneTodo = {
            id: counter++,
            todo: todoInput,
            isCompleted: false
        }
        storage.setItem("todoCounter", JSON.stringify(counter))
        console.log(counter);
        
        todosArray.unshift(oneTodo)
        elInput.value = null;
    }
    
    renderTodos(todosArray, elWrapper)
    storage.setItem("todoArray", JSON.stringify(todosArray))
})

function renderTodos(array, wrapper) {
    wrapper.innerHTML = null;
    let todoFragment = document.createDocumentFragment()
    
    array.forEach(item => {
        let todoItem = elTemplate.cloneNode(true)
        
        todoItem.querySelector("#checkbox__todo").dataset.todoId = item.id
        todoItem.querySelector("#todo-text").textContent = item.todo
        todoItem.querySelector("#todo-del").dataset.todoId = item.id
        
        if (item.isCompleted === true) {
            todoItem.querySelector("#checkbox__todo").checked = true
        }else {
            todoItem.querySelector("#checkbox__todo").checked = false
        }
        
        
        todoFragment.appendChild(todoItem)
    });
    
    wrapper.appendChild(todoFragment)
}


renderTodos(todosArray, elWrapper)

elWrapper.addEventListener("click", function (evt) {
    let check = evt.target.matches("#checkbox__todo")
    
    if (check) {
        let checkboxID = evt.target.dataset.todoId
        
        let foundTodo = todosArray.find(function (item) {
            return item.id == checkboxID
        })
        
        let foundTodoIndex = todosArray.findIndex(function (item) {
            return item.id == checkboxID
        })
        
        if (!foundTodo.isCompleted) {
            todosArray[foundTodoIndex].isCompleted == true
            foundTodo.isCompleted = true
        }else {
            todosArray[foundTodoIndex].isCompleted == false
            foundTodo.isCompleted = false
        }
        
        
        calculateTodos(todosArray)
        storage.setItem("todoArray", JSON.stringify(todosArray))
    }
    
    let checkForBtn = evt.target.matches("#todo-del")
    if (checkForBtn) {
        let checkboxID = evt.target.dataset.todoId
        
        let foundTodoIndex = todosArray.findIndex(function (item) {
            return item.id == checkboxID
        })
        
        todosArray.splice(foundTodoIndex, 1)
        
        
        renderTodos(todosArray, elWrapper)
        calculateTodos(todosArray)
        storage.setItem("todoArray", JSON.stringify(todosArray))
    }
    
})

function calculateTodos(array) {
    
    let completedTodo = array.filter(item => item.isCompleted === true)
    let uncompletedTodo = array.filter(item => item.isCompleted === false)
    
    let allTodoNumber = array.length;
    let completedTodoNumber = allTodoNumber - uncompletedTodo.length;
    let uncompletedTodoNumber = allTodoNumber - completedTodoNumber
    
    elAllCount.textContent = allTodoNumber;
    elCompletedCount.textContent = completedTodoNumber
    elUnompletedCount.textContent = uncompletedTodoNumber
    
    
    storage.setItem("todoArray", JSON.stringify(todosArray))
    renderTodos(todosArray, elWrapper)    
}

calculateTodos(todosArray)


elControl.addEventListener("click", function (evt) {
    // evt.preventDefault()
    let allBtn = evt.target.matches("#all-btn")
    let completedBtn = evt.target.matches("#completed-btn")
    let uncompletedBtn = evt.target.matches("#uncompleted-btn")
    
    
    if (allBtn) {
        renderTodos(todosArray, elWrapper)    
    }else if (completedBtn) {
        let completedTodo = todosArray.filter(item => item.isCompleted === true)
        renderTodos(completedTodo, elWrapper) 
          
    }else if (uncompletedBtn) {
        let uncompletedTodo = todosArray.filter(item => item.isCompleted === false)
        renderTodos(uncompletedTodo, elWrapper) 
    }
    storage.setItem("todoArray", JSON.stringify(todosArray))   
})