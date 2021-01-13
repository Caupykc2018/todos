class Engine {
    constructor() {
        this.listRenderElement = document.getElementById("todos");
        this.inputTitle = document.getElementById("inputTitle");
        this.btnAll = document.getElementById("btnAll");
        this.btnActive = document.getElementById("btnActive");
        this.btnCompleted = document.getElementById("btnCompleted");
        this.textCount = document.getElementById("count");
        this.btnClearCompleted = document.getElementById("btnClearCompleted");
        this.btnToggleAll = document.getElementById("btnToggleAll");
        this.btnLogOut = document.getElementById("log_out");
        this.displayName = document.getElementById("display_name");
        this.bottomMenu = document.getElementsByClassName("bottom_menu")[0];

        this.store = new Store();
        this.connector = new Connector(this.store, this);

        this.dispatch = this.connector.useDispatch();

        this.eventEmmiter = new EventEmitter();
    }

    async getAllTodos(userId) {
        const response = await fetch("http://localhost:3001/api/todos", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'user-id': userId
            }
        });
    
        const data = await response.json();
        if(response.ok) {
            this.dispatch({action: "INITIAL_TODOS", payload: {todos: data}});
        }
        else {
            alert(data.message);
        }
    }

    async addTodo(userId, title) {
        const response = await fetch("http://localhost:3001/api/todos", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'user-id': userId
            },
            body: JSON.stringify({
                title: title
            })
        });
    
        const data = await response.json();
        if(response.ok) {
            this.dispatch({action: "ADD_TODO", payload: {todo: data}});
        }
        else {
            alert(data.message);
        }
    }

    async editTodo(todoId, title) {
        const response = await fetch(`http://localhost:3001/api/todos/${todoId}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'user-id': this.currentUser.id
            },
            body: JSON.stringify({
                title: title
            })
        });
    
        const data = await response.json();
        if(response.ok) {
            this.dispatch({action: "SET_TODO", payload: {todo: data}});
        }
        else {
            alert(data.message);
        }
    }

    async removeTodo(todoId) {
        const response = await fetch(`http://localhost:3001/api/todos/${todoId}`, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'user-id': this.currentUser.id
            }
        });
    
        const data = await response.json();
        if(response.ok) {
            this.dispatch({action: "REMOVE_TODO", payload: {todo: data}});
        }
        else {
            alert(data.message);
        }
    }

    async toggleTodo(todoId, isCompleted) {
        const response = await fetch(`http://localhost:3001/api/todos/${todoId}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'user-id': this.currentUser.id
            },
            body: JSON.stringify({
                isCompleted: isCompleted
            })
        });
    
        const data = await response.json();
        if(response.ok) {
            this.dispatch({action: "SET_TODO", payload: {todo: data}});
        }
        else {
            alert(data.message);
        }
    } 

    renderCounter() {
        this.textCount.innerHTML = "";

        const btnClearCompleted = document.getElementById("btnClearCompleted");

        const countTodosActive = this.todos.filter(todo => !todo.isCompleted).length;
        const text = document.createTextNode(countTodosActive.toString());

        const isVisibleBtnClearCompleted = btnClearCompleted.classList.contains("no_visible");

        if(!!(this.todos.length - countTodosActive) === isVisibleBtnClearCompleted) {
            btnClearCompleted.classList.toggle("no_visible");
        }

        this.textCount.appendChild(text);
    }

    createViewTodo(todo) {
        const container = document.createElement("div");
        container.className = "todo";

        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "todo_checkbox_container";

        const checkbox = document.createElement("input");
        checkbox.className = "checkbox_status";
        checkbox.type = "checkbox";
        checkbox.checked = todo.isCompleted;

        if(todo.isEdit) {
            checkbox.style.visibility = "hidden";
        }

        const titleContainer = document.createElement("div");
        titleContainer.className = "todo_title_container";

        const title = document.createElement("p");
        title.className = "todo_title";

        const inputContainer = document.createElement("div");
        inputContainer.className = "input_edit_container";

        const inputEditTitle = document.createElement("input");
        inputEditTitle.id = "input_edit";
        inputEditTitle.className = "input_edit";
        inputEditTitle.type = "text";
        inputEditTitle.value = todo.title;

        const btnDeleteContainer = document.createElement("div");
        btnDeleteContainer.className = "btn_delete_container";
        btnDeleteContainer.style.display = "none";

        const btnDelete = document.createElement("button");
        btnDelete.id = todo.id;
        btnDelete.className = "btn_delete";

        const btnIcon = document.createElement("i");
        btnIcon.className = "fa fa-times";

        btnDelete.appendChild(btnIcon);

        const flexBoxLeftContainer = document.createElement("div");
        flexBoxLeftContainer.className = "todo_left_flexbox";

        const flexBoxRightContainer = document.createElement("div");
        flexBoxRightContainer.className = "todo_right_flexbox";

        title.appendChild(document.createTextNode(todo.title));

        if(todo.isCompleted) {
            title.style.textDecoration = "line-through";
            title.style.color = "lightgray";
        }

        !todo.isEdit && titleContainer.appendChild(title);

        inputContainer.appendChild(inputEditTitle);

        checkboxContainer.appendChild(checkbox);

        btnDeleteContainer.appendChild(btnDelete);

        flexBoxLeftContainer.appendChild(checkboxContainer);
        flexBoxLeftContainer.appendChild(!todo.isEdit ? titleContainer : inputContainer);

        flexBoxRightContainer.appendChild(btnDeleteContainer);

        container.appendChild(flexBoxLeftContainer);
        container.appendChild(flexBoxRightContainer);

        !todo.isEdit && container.addEventListener("mouseover", () => {
            btnDeleteContainer.style.display = "flex";
        });

        !todo.isEdit && container.addEventListener("mouseout", () => {
            btnDeleteContainer.style.display = "none";
        });

        return container;
    }

    renderList() {
        this.listRenderElement.innerHTML = "";

        let indexEditingTodo;

        this.viewTodos.forEach((todo, index) => {
            if(todo.isEdit) {
                indexEditingTodo = index;
            }

            this.listRenderElement.appendChild(this.createViewTodo(todo));
        });

        const containersTodo = document.getElementsByClassName("todo");
        const buttonsDelete = document.getElementsByClassName("btn_delete");
        const checkboxesStatus = document.getElementsByClassName("checkbox_status");
        const inputEdit = document.getElementById("input_edit");

        inputEdit?.focus();

        inputEdit?.addEventListener("focusout", () => {
            this.dispatch({action: "TOGGLE_EDIT", payload: {index: indexEditingTodo}});
            this.dispatch({action: "RELOAD_VIEW_TODOS"});
        });

        inputEdit?.addEventListener("keypress", (e) => {
            if(!inputEdit.value.trim()) return;
            if(e.key === "Enter") {
                this.dispatch({action: "EDIT", payload: {index: indexEditingTodo, title: inputEdit.value.trim()}});
            }
        });

        this.viewTodos.forEach((todo, index) => {
            !todo.isEdit && containersTodo[index].addEventListener("dblclick", () => {
                indexEditingTodo && this.dispatch({action: "TOGGLE_EDIT", payload: {index: indexEditingTodo}});
                this.dispatch({action: "TOGGLE_EDIT", payload: {index: index}});
            });

            buttonsDelete[index].addEventListener("click", async () => {
                await this.removeTodo(todo._id);
                this.dispatch({action: "RELOAD_VIEW_TODOS"});
            });

            checkboxesStatus[index].addEventListener("change", async () => {
                await this.toggleTodo(todo._id, !todo.isCompleted);
                this.dispatch({action: "RELOAD_VIEW_TODOS"});
            });
        });
    }

    renderControlElements(){
        if(this.todos.length) {
            this.bottomMenu.style.display = "flex";
            this.btnToggleAll.style.visibility = "visible";
            if(this.todos.filter(todo => todo.isCompleted).length === this.todos.length) {
                this.btnToggleAll.style.color = "black";
            }
            else {
                this.btnToggleAll.style.color = "rgba(175, 47, 47, 0.15)";
            }
        }
        else {
            this.bottomMenu.style.display = "none";
            this.btnToggleAll.style.visibility = "hidden";
        }
    }

    render() {
        this.currentUser = this.connector.useSelector(state => state.currentUser);
        this.todos = this.connector.useSelector(state => state.todos);
        this.viewTodos = this.connector.useSelector(state => state.viewTodos);
        
        if(this.currentUser.id) {
            this.renderControlElements();
            this.renderList();
            this.renderCounter();
        }
    }

    toggleTab({button, tab}) {
        const allBtn = [
            this.btnAll,
            this.btnActive,
            this.btnCompleted
        ].filter(btn => btn.id !== button.id);

        allBtn.forEach(btn => btn.classList.contains("current_btn") && btn.classList.toggle("current_btn"));
        button.classList.toggle("current_btn");
        this.dispatch({action: "SET_TAB", payload: {tab: tab}});
        this.dispatch({action: "RELOAD_VIEW_TODOS"});
    }

    async init() {
        this.currentUser = this.connector.useSelector(state => state.currentUser);
        this.currentTab = this.connector.useSelector(state => state.currentTab[this.currentUser.id]);
        this.todos = this.connector.useSelector(state => state.todos);
        
        if(!this.currentUser.id) {
            window.location.href = "../../../client/pages/login";
        }

        await this.getAllTodos(this.currentUser.id);

        if(!this.currentTab) {
            this.dispatch({action: "SET_TAB", payload: {tab: TABS.All}})
        }

        this.displayName.appendChild(document.createTextNode(this.currentUser.login || ""));

        this.eventEmmiter.on("toggle-all", () => {
            this.dispatch({action: "TOGGLE_ALL_STATUS"});
            this.dispatch({action: "RELOAD_VIEW_TODOS"});
        });

        this.eventEmmiter.on("clear-completed", () => {
            this.dispatch({action: "CLEAR_COMPLETED"});
            this.dispatch({action: "RELOAD_VIEW_TODOS"});
        });

        this.eventEmmiter.on("toggle-tab", (data) => {
            this.toggleTab(data);
        });

        this.eventEmmiter.on("keypress-input", async ({input, key}) => {
            if(!input.value.trim()) return;
            if(key === "Enter") {
                await this.addTodo(this.currentUser.id, input.value.trim())
                this.dispatch({action: "RELOAD_VIEW_TODOS"});
                input.value = "";
            }
        });

        const btnTabs = {};
        btnTabs[TABS.All] = this.btnAll;
        btnTabs[TABS.Active] = this.btnActive;
        btnTabs[TABS.Completed] = this.btnCompleted;

        this.eventEmmiter.emit("toggle-tab", {button: btnTabs[this.currentTab], tab: this.currentTab});

        this.btnLogOut.addEventListener("click", () => {
            this.dispatch({action: "LOG_OUT"});
            window.location.href = "../../../pages/login";
        });

        this.btnToggleAll.addEventListener("click", () => this.eventEmmiter.emit("toggle-all"));
        this.btnClearCompleted.addEventListener("click", () => this.eventEmmiter.emit("clear-completed"));

        this.btnAll.addEventListener("click", () => this.eventEmmiter.emit("toggle-tab", {button: this.btnAll, tab: TABS.All}));
        this.btnActive.addEventListener("click", () => this.eventEmmiter.emit("toggle-tab", {button: this.btnActive, tab: TABS.Active}));
        this.btnCompleted.addEventListener("click", () => this.eventEmmiter.emit("toggle-tab", {button: this.btnCompleted, tab: TABS.Completed}));

        this.inputTitle.addEventListener("keypress", (e) => this.eventEmmiter.emit("keypress-input", {input: this.inputTitle, key: e.key}));

        this.store.dispatch("RELOAD_VIEW_TODOS");
    }
}

window.onload = async () => {
    const engine = new Engine();
    await engine.init();
}
