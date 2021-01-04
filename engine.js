class Todo {
    constructor(title) {
        this.title = title;
        this.isCompleted = false;
        this.created = new Date();
    }

    toggleStatus() {
        this.isCompleted = !this.isCompleted;
    }
}

window.onload = () => {
    const todosContainer = document.getElementById("todos");
    const inputTitle = document.getElementById("inputTitle");

    const btnAll = document.getElementById("btnAll");
    const btnActive = document.getElementById("btnActive");
    const btnCompleted = document.getElementById("btnCompleted");
    const textCount = document.getElementById("count");
    const btnClearCompleted = document.getElementById("btnClearCompleted");

    const todoList = [];

    let countLeft = 0;

    let viewedTodoList = todoList;

    let currentTab = "All";

    const handlerInput = (e) => {
        if(!inputTitle.value.trim()) return; 
        if(e.keyCode == 13) {
            todoList.push(new Todo(inputTitle.value.trim()));
            inputTitle.value = "";
            views(true);
        }
    }

    inputTitle.addEventListener("keypress", handlerInput);

    function viewTodo (todo) {
        const container = document.createElement("div");
        container.className = "todo";

        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "todo_checkbox";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.isCompleted;

        checkbox.addEventListener('change', (checked) => {
            todo.toggleStatus();
            views();
            if(todo.isCompleted){
                countLeft -= 1;
            }
            else {
                countLeft += 1;
            }

            viewCount();
        });
        
        const titleContainer = document.createElement("div");
        
        const title = document.createElement("h5");
        
        title.appendChild(document.createTextNode(todo.title));

        titleContainer.appendChild(title);
        checkboxContainer.appendChild(checkbox);

        container.appendChild(checkboxContainer);
        container.appendChild(titleContainer);
    

        todosContainer.appendChild(container);
    }
    
    function views (isNewTodo = false) {
        todosContainer.innerHTML = "";
        if(isNewTodo) {
            countLeft += 1;
            viewCount();
        }

        switch (currentTab) {
            case "All":
                viewedTodoList = todoList; 
                break;
            case "Active":
                viewedTodoList = todoList.filter(todo => !todo.isCompleted);
                break;
            case "Completed":
                viewedTodoList = todoList.filter(todo => todo.isCompleted);
                break;
        }

        viewedTodoList.forEach(todo => viewTodo(todo));
        
        if((todoList.length - countLeft !== 0) !== btnClearCompleted.classList.contains("no_visible")) {
            btnClearCompleted.classList.toggle("no_visible");
        }
    }

    function viewCount (){
        textCount.innerHTML = "";
        textCount.appendChild(document.createTextNode(countLeft));
    }

    function toggleTab (curBtn, tab) {
        const allBtn = [btnAll, btnActive, btnCompleted].filter(btn => btn.id != curBtn.id);
        
        return () => {
            allBtn.forEach(btn => btn.classList.contains("current_btn") && btn.classList.toggle("current_btn"));
            curBtn.classList.toggle("current_btn");
            currentTab = tab;
            views();
        }
    }

    btnAll.onclick = toggleTab(btnAll, "All");
    btnActive.onclick = toggleTab(btnActive, "Active");
    btnCompleted.onclick = toggleTab(btnCompleted, "Completed");
}