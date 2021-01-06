const TABS = {
    All: "All",
    Active: "Active",
    Completed: "Completed"
}

class Todo {
    constructor(listRenderElement, title) {
        this.id = new Date().getTime();
        this.title = title;
        this.isCompleted = false;
        this.listRenderElement = listRenderElement;
    }

    edit(title) {
        this.title = title;
    }

    toggleStatus() {
        this.isCompleted = !this.isCompleted;
    }

    render() {
        const container = document.createElement("div");
        container.className = "todo";

        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "todo_checkbox";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = this.isCompleted;
        checkbox.className = "checkbox_status";

        const titleContainer = document.createElement("div");

        const title = document.createElement("p");

        const btnDeleteContainer = document.createElement("div");
        btnDeleteContainer.style.visibility = "hidden";

        const btnDelete = document.createElement("button");
        btnDelete.id = this.id.toString();

        btnDelete.className = "btn_delete";

        const btnIcon = document.createElement("i");
        btnIcon.className = "fa fa-times";

        btnDelete.appendChild(btnIcon);

        const firstContainer = document.createElement("div");
        const secondContainer = document.createElement("div");

        title.appendChild(document.createTextNode(this.title));

        titleContainer.appendChild(title);
        checkboxContainer.appendChild(checkbox);

        btnDeleteContainer.appendChild(btnDelete);

        firstContainer.appendChild(checkboxContainer);
        firstContainer.appendChild(titleContainer);

        secondContainer.appendChild(btnDeleteContainer);

        container.appendChild(firstContainer);
        container.appendChild(secondContainer);

        container.addEventListener("mouseover", () => {
            btnDeleteContainer.style.visibility = "visible";
        });

        container.addEventListener("mouseout", () => {
            btnDeleteContainer.style.visibility = "hidden";
        });

        this.listRenderElement.appendChild(container);
    }
}

class TodoList {
    constructor(listRenderElement, counterRenderElement) {
        this.list = [];
        this.viewList = this.list;
        this.listRenderElement = listRenderElement;
        this.counterRenderElement = counterRenderElement;
    }

    add(title) {
        this.list.push(new Todo(this.listRenderElement, title));
        this.render();
    }

    remove(id) {
        this.list = this.list.filter((todo) => todo.id !== id);
        this.render();
    }

    toggleAll() {
        const todosActive = this.list.filter(todo => !todo.isCompleted);

        if(todosActive.length !== 0) {
            todosActive.forEach(todo => todo.toggleStatus());
        }
        else {
            this.list.forEach(todo => todo.toggleStatus());
        }

        this.render();
    }

    clearCompleted() {
        this.list = this.list.filter(todo => !todo.isCompleted);
        this.render();
    }

    switchRenderList(tab) {
        switch (tab) {
            case TABS.All:
                this.viewList = this.list;
                break;
            case TABS.Active:
                this.viewList = this.list.filter(todo => !todo.isCompleted);
                break;
            case TABS.Completed:
                this.viewList = this.list.filter(todo => todo.isCompleted);
                break;
        }

        this.render();
    }

    renderCounter() {
        this.counterRenderElement.innerHTML = "";

        const countTodosActive = this.list.filter(todo => !todo.isCompleted).length;
        const text = document.createTextNode(countTodosActive.toString());

        this.counterRenderElement.appendChild(text);
    }

    renderList() {
        this.listRenderElement.innerHTML = "";

        this.viewList.forEach(todo => todo.render());

        const buttonsDelete = document.getElementsByClassName("btn_delete");
        const checkboxesStatus = document.getElementsByClassName("checkbox_status");

        for(let index = 0; index < this.viewList.length; index += 1) {
            buttonsDelete[index].addEventListener("click", () => {
                this.remove(this.viewList[index].id);
            });

            checkboxesStatus[index].addEventListener("change", () => {
                this.viewList[index].toggleStatus();
                this.render();
            })
        }
    }

    render() {
        this.renderList();
        this.renderCounter();
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

    let todoList = new TodoList(todosContainer, textCount);

    inputTitle.addEventListener("keypress", (e) => {
        if(!inputTitle.value.trim()) return;
        if(e.key === "Enter") {
            todoList.add(inputTitle.value.trim());
            inputTitle.value = "";
        }
    });

    const toggleTab = (currentBtn, tab) => {
        const allBtn = [btnAll, btnActive, btnCompleted].filter(btn => btn.id !== currentBtn.id);

        return () => {
            allBtn.forEach(btn => btn.classList.contains("current_btn") && btn.classList.toggle("current_btn"));
            currentBtn.classList.toggle("current_btn");
            todoList.switchRenderList(tab);
        }
    }

    btnToggleAll.addEventListener("click", todoList.toggleAll);
    btnClearCompleted.addEventListener("click", todoList.clearCompleted);

    btnAll.addEventListener("click", toggleTab(btnAll, TABS.All));
    btnActive.addEventListener("click", toggleTab(btnAll, TABS.Active));
    btnCompleted.addEventListener("click", toggleTab(btnAll, TABS.Completed));
}
        // const countTodos = this.list.length;
        // const isVisibleBtnClearCompleted = btnClearCompleted.classList.contains("no_visible");

        // if((countTodos - countTodosActive > 0) && isVisibleBtnClearCompleted) {
        //     btnClearCompleted.classList.toggle("no_visible");
        // }
        // else if((countTodos - countTodosActive === 0) && !isVisibleBtnClearCompleted) {
        //     btnClearCompleted.classList.toggle("no_visible");
        // }
