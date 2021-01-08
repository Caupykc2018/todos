class TodoList {
    constructor(counterRenderElement, btnToggleAll) {
        this.listRenderElement = document.getElementById("todos");
        
        this.counterRenderElement = counterRenderElement;
        this.btnToggleAll = btnToggleAll;
        this.bottomMenu = document.getElementsByClassName("bottom_menu")[0];
    }

    setStore(store) {
        this.store = store;
        this.viewList = this.store.getStore().todos;
    }

    getStoreTodos() {
        return this.store.getStore().todos;
    }

    add(title) {
        this.store.dispatch("ADD", {todo: new Todo(title)});
    }

    remove(id) {
        this.store.dispatch("DELETE", {id: id});
    }

    toggleAll() {
        this.store.dispatch("TOGGLE_ALL_STATUS");
    }

    clearCompleted() {
        this.store.dispatch("CLEAR_COMPLETED");
    }

    reloadViewList() {
        switch (this.store.getStore().currentTab) {
            case TABS.All:
                this.viewList = [...this.getStoreTodos()];
                break;
            case TABS.Active:
                this.viewList = this.getStoreTodos().filter(todo => !todo.isCompleted);
                break;
            case TABS.Completed:
                this.viewList = this.getStoreTodos().filter(todo => todo.isCompleted);
                break;
            default:
                this.viewList = [...this.getStoreTodos()];
        }
    }

    renderCounter() {
        this.counterRenderElement.innerHTML = "";

        const btnClearCompleted = document.getElementById("btnClearCompleted");

        const countTodosActive = this.getStoreTodos().filter(todo => !todo.isCompleted).length;
        const text = document.createTextNode(countTodosActive.toString());

        const isVisibleBtnClearCompleted = btnClearCompleted.classList.contains("no_visible");

        if(!!(this.getStoreTodos().length - countTodosActive) === isVisibleBtnClearCompleted) {
            btnClearCompleted.classList.toggle("no_visible");
        }

        this.counterRenderElement.appendChild(text);
    }

    renderList() {
        this.listRenderElement.innerHTML = "";

        this.reloadViewList();

        let indexEditingTodo;

        this.viewList.forEach((todo, index) => {
            if(todo.isEdit) {
                indexEditingTodo = index;
            }

            todo.render();
        });

        const containersTodo = document.getElementsByClassName("todo");
        const buttonsDelete = document.getElementsByClassName("btn_delete");
        const checkboxesStatus = document.getElementsByClassName("checkbox_status");
        const inputEdit = document.getElementById("input_edit");

        inputEdit?.focus();

        inputEdit?.addEventListener("focusout", (e) => {
            this.store.dispatch("TOGGLE_EDIT", {index: indexEditingTodo});
        });

        inputEdit?.addEventListener("keypress", (e) => {
            if(!inputEdit.value.trim()) return;
            if(e.key === "Enter") {
                this.store.dispatch("edit", {index: indexEditingTodo, title: inputEdit.value.trim()});
            }
        });

        this.viewList.forEach((todo, index) => {
            !todo.isEdit && containersTodo[index].addEventListener("dblclick", () => {
                indexEditingTodo && this.store.dispatch("TOGGLE_EDIT", {index: indexEditingTodo});
                this.store.dispatch("TOGGLE_EDIT", {index: index});
            });

            buttonsDelete[index].addEventListener("click", () => {
                this.remove(todo.id);
            });

            checkboxesStatus[index].addEventListener("change", () => {
                this.store.dispatch("TOGGLE_STATUS", {index: index});
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
        this.renderControlElements();
        this.renderList();
        this.renderCounter();
    }


}
