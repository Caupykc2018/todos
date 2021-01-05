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
    const btnToggleAll = document.getElementById("btnToggleAll");

    const todoList = [];

    let viewedTodoList = todoList;

    let currentTab = "All";

    const handlerInput = (e) => {
        if(!inputTitle.value.trim()) return;
        if(e.keyCode === 13) {
            todoList.push(new Todo(inputTitle.value.trim()));
            inputTitle.value = "";
            views();
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

        checkbox.addEventListener('change', () => {
            todo.toggleStatus();
            views();
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

    function views () {
        todosContainer.innerHTML = "";

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
        viewCount();
    }

    function viewCount (){
        textCount.innerHTML = "";

        const countTodosActive = todoList.filter(todo => !todo.isCompleted).length;
        const countTodos = todoList.length;
        const isVisibleBtnClearCompleted = btnClearCompleted.classList.contains("no_visible");

        if((countTodos - countTodosActive > 0) && isVisibleBtnClearCompleted) {
            btnClearCompleted.classList.toggle("no_visible");
        }
        else if((countTodos - countTodosActive === 0) && !isVisibleBtnClearCompleted) {
            btnClearCompleted.classList.toggle("no_visible");
        }

        const text = document.createTextNode(countTodosActive.toString());
        textCount.appendChild(text);
    }

    function toggleAll() {
        const todosActive = todoList.filter(todo => !todo.isCompleted);

        if(todosActive.length !== 0) {
            todosActive.forEach(todo => todo.toggleStatus());
        }
        else {
            todoList.forEach(todo => todo.toggleStatus());
        }

        views();
    }

    function toggleTab (curBtn, tab) {
        const allBtn = [btnAll, btnActive, btnCompleted].filter(btn => btn.id !== curBtn.id);

        return () => {
            allBtn.forEach(btn => btn.classList.contains("current_btn") && btn.classList.toggle("current_btn"));
            curBtn.classList.toggle("current_btn");
            currentTab = tab;
            views();
        }
    }

    btnToggleAll.onclick = toggleAll;

    btnAll.onclick = toggleTab(btnAll, "All");
    btnActive.onclick = toggleTab(btnActive, "Active");
    btnCompleted.onclick = toggleTab(btnCompleted, "Completed");
}
