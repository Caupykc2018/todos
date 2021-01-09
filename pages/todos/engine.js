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

        this.store = new Store(() => this.render());

        this.displayName.appendChild(document.createTextNode(this.store.getStore().currentUser.login || ""));

        this.eventEmmiter = new EventEmitter();
    }

    getStoreTodos() {
        return this.store.getStore().todos[this.store.getStore().currentUser.id];
    }

    getStoreViewTodos() {
        return this.store.getStore().viewTodos;
    }

    renderCounter() {
        this.textCount.innerHTML = "";

        const btnClearCompleted = document.getElementById("btnClearCompleted");

        const countTodosActive = this.getStoreTodos().filter(todo => !todo.isCompleted).length;
        const text = document.createTextNode(countTodosActive.toString());

        const isVisibleBtnClearCompleted = btnClearCompleted.classList.contains("no_visible");

        if(!!(this.getStoreTodos().length - countTodosActive) === isVisibleBtnClearCompleted) {
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
        btnDelete.id = todo.id.toString();
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

        this.getStoreViewTodos().forEach((todo, index) => {
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
            this.store.dispatch("TOGGLE_EDIT", {index: indexEditingTodo});
            this.store.dispatch("RELOAD_VIEW_TODOS");
        });

        inputEdit?.addEventListener("keypress", (e) => {
            if(!inputEdit.value.trim()) return;
            if(e.key === "Enter") {
                this.store.dispatch("EDIT", {index: indexEditingTodo, title: inputEdit.value.trim()});
            }
        });

        this.getStoreViewTodos().forEach((todo, index) => {
            !todo.isEdit && containersTodo[index].addEventListener("dblclick", () => {
                indexEditingTodo && this.store.dispatch("TOGGLE_EDIT", {index: indexEditingTodo});
                this.store.dispatch("TOGGLE_EDIT", {index: index});
            });

            buttonsDelete[index].addEventListener("click", () => {
                this.store.dispatch("DELETE", {id: todo.id});
                this.store.dispatch("RELOAD_VIEW_TODOS");
            });

            checkboxesStatus[index].addEventListener("change", () => {
                this.store.dispatch("TOGGLE_STATUS", {index: index});
                this.store.dispatch("RELOAD_VIEW_TODOS");
            });
        });
    }

    renderControlElements(){
        if(this.getStoreTodos().length) {
            this.bottomMenu.style.display = "flex";
            this.btnToggleAll.style.visibility = "visible";
            if(this.getStoreTodos().filter(todo => todo.isCompleted).length === this.getStoreTodos().length) {
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
        if(this.store.getStore().currentUser.id) {
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
        this.store.dispatch("SET_TAB", {tab: tab});
        this.store.dispatch("RELOAD_VIEW_TODOS");
    }

    init() {
        if(!this.store.getStore().currentUser.id) {
            window.location.href = "../../../todos/pages/login";
        }

        this.eventEmmiter.on("toggle-all", () => {
            this.store.dispatch("TOGGLE_ALL_STATUS");
            this.store.dispatch("RELOAD_VIEW_TODOS");
        });

        this.eventEmmiter.on("clear-completed", () => {
            this.store.dispatch("CLEAR_COMPLETED");
            this.store.dispatch("RELOAD_VIEW_TODOS");
        });

        this.eventEmmiter.on("toggle-tab", (data) => {
            this.toggleTab(data);
        });

        this.eventEmmiter.on("keypress-input", ({input, key}) => {
            if(!input.value.trim()) return;
            if(key === "Enter") {
                this.store.dispatch("ADD", {todo: new Todo(input.value.trim())});
                this.store.dispatch("RELOAD_VIEW_TODOS");
                input.value = "";
            }
        });

        const btnTabs = {};
        btnTabs[TABS.All] = this.btnAll;
        btnTabs[TABS.Active] = this.btnActive;
        btnTabs[TABS.Completed] = this.btnCompleted;

        this.eventEmmiter.emit("toggle-tab", {button: btnTabs[this.store.getStore().currentTab[this.store.getStore().currentUser.id]], tab: this.store.getStore().currentTab[this.store.getStore().currentUser.id]});

        this.btnLogOut.addEventListener("click", () => {
            this.store.dispatch("LOG_OUT");
            console.log(this.store.getStore());
            window.location.href = "../../../todos/pages/login";
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

window.onload = () => {
    const engine = new Engine();
    engine.init();
}
