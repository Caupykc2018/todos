const TABS = {
    All: "All",
    Active: "Active",
    Completed: "Completed"
}

class Todo {
    constructor(title) {
        this.id = new Date();
        this.title = title;
        this.isCompleted = false;
    }

    edit(title) {
        this.title = title;
    }

    toggleStatus() {
        this.isCompleted = !this.isCompleted;
    }

    render(listRenderElement, handleRemove, listRender) {
        const container = document.createElement("div");
        container.className = "todo";

        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "todo_checkbox";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = this.isCompleted;

        checkbox.addEventListener('change', () => {
            this.toggleStatus();
            listRender();
        });

        const titleContainer = document.createElement("div");

        const title = document.createElement("p");

        const btnDeleteContainer = document.createElement("div");
        btnDeleteContainer.style.visibility = "hidden";

        const btnDelete = document.createElement("button");
        
        btnDelete.className = "btn_delete";

        btnDelete.onclick = () => {
            handleRemove();
            listRender();
        }

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

        container.onmouseover = () => {
            btnDeleteContainer.style.visibility = "visible";
        }

        container.onmouseout = () => {
            btnDeleteContainer.style.visibility = "hidden";
        }

        listRenderElement.appendChild(container);
    }
}

class TodoList {
    constructor(domNode) {
        this.list = [];
        this.viewList = this.list;
        this.domNode = domNode
    }

    add(title) {
        this.list.push(new Todo(title));
    }

    remove(id) {
        console.log(this);
        this.list = this.list.filter((todo) => id !== todo.id);
    }

    toggleAll() {
        const todosActive = this.list.filter(todo => !todo.isCompleted);

        if(todosActive.length !== 0) {
            todosActive.forEach(todo => todo.toggleStatus());
        }
        else {
            this.list.forEach(todo => todo.toggleStatus());
        }
    }

    clearCompleted() {
        this.list = this.list.filter(todo => !todo.isCompleted);
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
    }

    render(listRenderElement, counterRenderElement) {
        listRenderElement.innerHTML = "";
        counterRenderElement.innerHTML = "";

        const countTodosActive = this.list.filter(todo => !todo.isCompleted).length;

        const text = document.createTextNode(countTodosActive.toString());

        function configuredRender() { this.render(listRenderElement, counterRenderElement) };

        this.viewList.forEach(todo => todo.render(listRenderElement, counterRenderElement, () => this.remove(todo.id), configuredRender));

        counterRenderElement.appendChild(text);
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

    let todoList = new TodoList(todosContainer);

    let currentTab = TABS.All;

    let render = () => {
        todoList.switchRenderList(currentTab);
        todoList.render(todosContainer, textCount);
    }

    const handlerInput = (e) => {
        if(!inputTitle.value.trim()) return;
        if(e.keyCode === 13) {
            todoList.add(inputTitle.value.trim());
            inputTitle.value = "";
            render();
        }
    }

    inputTitle.addEventListener("keypress", handlerInput);

    const toggleAll = () => {
        todoList.toggleAll();
        render();
    }

    const clearCompleted = () => {
        todoList.clearCompleted();
        render();
    }

    const toggleTab = (curBtn, tab) => {
        const allBtn = [btnAll, btnActive, btnCompleted].filter(btn => btn.id !== curBtn.id);

        return () => {
            allBtn.forEach(btn => btn.classList.contains("current_btn") && btn.classList.toggle("current_btn"));
            curBtn.classList.toggle("current_btn");
            currentTab = tab;
            render();
        }
    }

    btnToggleAll.onclick = toggleAll;
    btnClearCompleted.onclick = clearCompleted;

    btnAll.onclick = toggleTab(btnAll, TABS.All);
    btnActive.onclick = toggleTab(btnActive, TABS.Active);
    btnCompleted.onclick = toggleTab(btnCompleted, TABS.Completed);
}
        // const countTodos = this.list.length;
        // const isVisibleBtnClearCompleted = btnClearCompleted.classList.contains("no_visible");

        // if((countTodos - countTodosActive > 0) && isVisibleBtnClearCompleted) {
        //     btnClearCompleted.classList.toggle("no_visible");
        // }
        // else if((countTodos - countTodosActive === 0) && !isVisibleBtnClearCompleted) {
        //     btnClearCompleted.classList.toggle("no_visible");
        // }