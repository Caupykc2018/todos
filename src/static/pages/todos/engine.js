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

        this.api = new API();

        this.dispatch = this.connector.useDispatch();

        this.eventEmmiter = new EventEmitter();
    }

    async refreshToken() {
        await this.api.query(
            "/api/refresh-token",
            "POST",
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            {
                refreshToken: this.currentUser.refreshToken
            }
        );

        if(this.api.data !== null) {
            this.dispatch({action: "SET_TOKENS_USER", payload: {user: this.api.data}});
        }
        else {
            this.dispatch({action: "LOG_OUT"});
        }
    }

    async getAllTodos() {
        await this.api.query(
            "/api/todos",
            "GET",
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.currentUser.token
            }
        );

        if(this.api.data) {
            this.dispatch({action: "INITIAL_TODOS", payload: {todos: this.api.data}});
        }
        else {
            alert(this.api.error.message);
        }
    }

    async addTodo(title) {
        await this.api.query(
            "/api/todos",
            "POST",
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.currentUser.token
            },
            {
                title: title
            }
        );

        if(this.api.data) {
            this.dispatch({action: "ADD_TODO", payload: {todo: this.api.data}});
        }
        else {
            alert(this.api.error.message);
        }
    }

    async editTodo(todoId, title) {
        await this.api.query(
            `/api/todos/${todoId}`,
            "PUT",
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.currentUser.token
            },
            {
                title: title
            }
        );

        if(this.api.data) {
            this.dispatch({action: "SET_TODO", payload: {todo: this.api.data}});
        }
        else {
            alert(this.api.error.message);
        }
    }

    async removeTodo(todoId) {
        await this.api.query(
            `/api/todos/${todoId}`,
            "DELETE",
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.currentUser.token
            }
        );

        if(this.api.data) {
            this.dispatch({action: "REMOVE_TODO", payload: {todo: this.api.data}});
        }
        else {
            alert(this.api.error.message);
        }
    }

    async toggleTodo(todoId, isCompleted) {
        await this.api.query(
            `/api/todos/${todoId}`,
            "PUT",
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.currentUser.token
            },
            {
                isCompleted: isCompleted
            }
        );

        if(this.api.data) {
            this.dispatch({action: "SET_TODO", payload: {todo: this.api.data}});
        }
        else {
            alert(this.api.error.message);
        }
    }

    async toggleAll() {
        await this.api.query(
            "/api/todos/toggle-all",
            "POST",
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.currentUser.token
            }
        );

        if(this.api.data) {
            this.dispatch({action: "SET_TODOS", payload: {todos: this.api.data}});
        }
        else {
            alert(this.api.error.message);
        }
    }

    async clearCompleted() {
        await this.api.query(
            "/api/todos/clear-completed",
            "POST",
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.currentUser.token
            }
        );

        if(this.api.data) {
            this.dispatch({action: "REMOVE_TODOS", payload: {todos: this.api.data}});
        }
        else {
            alert(this.api.error.message);
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

        let editingTodo;

        this.viewTodos.forEach((todo) => {
            if(todo.isEdit) {
                editingTodo = todo;
            }

            this.listRenderElement.appendChild(this.createViewTodo(todo));
        });

        const containersTodo = document.getElementsByClassName("todo");
        const buttonsDelete = document.getElementsByClassName("btn_delete");
        const checkboxesStatus = document.getElementsByClassName("checkbox_status");
        const inputEdit = document.getElementById("input_edit");

        inputEdit?.focus();

        inputEdit?.addEventListener("focusout", () => {
            this.dispatch({action: "TOGGLE_EDIT_STATUS_TODO", payload: {id: editingTodo._id}});
        });

        inputEdit?.addEventListener("keypress", async (e) => {
            if(!inputEdit.value.trim()) return;
            if(e.key === "Enter") {
                await this.editTodo(editingTodo._id, inputEdit.value.trim());
            }
        });

        this.viewTodos.forEach((todo, index) => {
            !todo.isEdit && containersTodo[index].addEventListener("dblclick", () => {
                editingTodo && this.dispatch({action: "TOGGLE_EDIT_STATUS_TODO", payload: {id: editingTodo._id}});
                this.dispatch({action: "TOGGLE_EDIT_STATUS_TODO", payload: {id: todo._id}});
            });

            buttonsDelete[index].addEventListener("click", async () => {
                await this.removeTodo(todo._id);
            });

            checkboxesStatus[index].addEventListener("change", async () => {
                await this.toggleTodo(todo._id, !todo.isCompleted);
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
        this.currentTab = this.connector.useSelector(state => state.currentTab[this.currentUser.login]);
        this.viewTodos = this.connector.useSelector(state => {
            switch (this.currentTab) {
                case TABS.All:
                    return [...state.todos];
                case TABS.Active:
                    return state.todos.filter(todo => !todo.isCompleted);
                case TABS.Completed:
                    return state.todos.filter(todo => todo.isCompleted);
                default:
                    return state.todos
            }
        });

        if(!this.currentUser.login) {
            window.location.href = "../login/";
        }

        if (this.currentUser.login && this.currentTab) {
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
    }

    async init() {
        this.currentUser = this.connector.useSelector(state => state.currentUser);
        this.currentTab = this.connector.useSelector(state => state.currentTab[this.currentUser.id]);
        this.todos = this.connector.useSelector(state => state.todos);

        if(!this.currentUser.login) {
            window.location.href = "../login/";
        }


        if(!this.currentTab) {
            this.dispatch({action: "SET_TAB", payload: {tab: TABS.All}})
        }

        this.displayName.appendChild(document.createTextNode(this.currentUser.login || ""));

        this.eventEmmiter.on("toggle-all", async () => {
            await this.toggleAll();
        });

        this.eventEmmiter.on("clear-completed", async () => {
            await this.clearCompleted();
        });

        this.eventEmmiter.on("toggle-tab", (data) => {
            this.toggleTab(data);
        });

        this.eventEmmiter.on("keypress-input", async ({input, key}) => {
            if(!input.value.trim()) return;
            if(key === "Enter") {
                await this.addTodo(input.value.trim())
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
        });

        this.btnToggleAll.addEventListener("click", () => this.eventEmmiter.emit("toggle-all"));
        this.btnClearCompleted.addEventListener("click", () => this.eventEmmiter.emit("clear-completed"));

        this.btnAll.addEventListener("click", () => this.eventEmmiter.emit("toggle-tab", {button: this.btnAll, tab: TABS.All}));
        this.btnActive.addEventListener("click", () => this.eventEmmiter.emit("toggle-tab", {button: this.btnActive, tab: TABS.Active}));
        this.btnCompleted.addEventListener("click", () => this.eventEmmiter.emit("toggle-tab", {button: this.btnCompleted, tab: TABS.Completed}));

        this.inputTitle.addEventListener("keypress", (e) => this.eventEmmiter.emit("keypress-input", {input: this.inputTitle, key: e.key}));

        await this.refreshToken();

        setInterval(async () => await this.refreshToken(), 60000);

        await this.getAllTodos();
    }
}

window.onload = async () => {
    const engine = new Engine();
    await engine.init();
}
