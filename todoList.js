class TodoList {
    constructor(listRenderElement, counterRenderElement, btnToggleAll) {
        this.list = [];
        this.viewList = [];
        this.listRenderElement = listRenderElement;
        this.counterRenderElement = counterRenderElement;
        this.currentTab = TABS.All;
        this.btnToggleAll = btnToggleAll;
        this.bottomMenu = document.getElementsByClassName("bottom_menu")[0];
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

        if(todosActive.length) {
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

    reloadViewList() {
        switch (this.currentTab) {
            case TABS.All:
                this.viewList = [...this.list];
                break;
            case TABS.Active:
                this.viewList = this.list.filter(todo => !todo.isCompleted);
                break;
            case TABS.Completed:
                this.viewList = this.list.filter(todo => todo.isCompleted);
                break;
        }
    }

    switchViewList(tab) {
        this.currentTab = tab;
        this.render();
    }

    renderCounter() {
        this.counterRenderElement.innerHTML = "";

        const btnClearCompleted = document.getElementById("btnClearCompleted");

        const countTodosActive = this.list.filter(todo => !todo.isCompleted).length;
        const text = document.createTextNode(countTodosActive.toString());

        const isVisibleBtnClearCompleted = btnClearCompleted.classList.contains("no_visible");

        if(!!(this.list.length - countTodosActive) === isVisibleBtnClearCompleted) {
            btnClearCompleted.classList.toggle("no_visible");
        }

        this.counterRenderElement.appendChild(text);
    }

    renderList() {
        this.listRenderElement.innerHTML = "";

        this.reloadViewList();

        let editingTodo;

        this.viewList.forEach(todo => {
            if(todo.isEdit) editingTodo = todo;

            todo.render();
        });

        const containersTodo = document.getElementsByClassName("todo");
        const buttonsDelete = document.getElementsByClassName("btn_delete");
        const checkboxesStatus = document.getElementsByClassName("checkbox_status");
        const inputEdit = document.getElementById("input_edit");

        inputEdit?.focus();

        inputEdit?.addEventListener("focusout", (e) => {
            editingTodo.toggleEditStatus();
            this.render();
        });

        inputEdit?.addEventListener("keypress", (e) => {
            if(!inputEdit.value.trim()) return;
            if(e.key === "Enter") {
                editingTodo.edit(inputEdit.value.trim());
                this.render();
            }
        });

        this.viewList.forEach((todo, index) => {
            !todo.isEdit && containersTodo[index].addEventListener("dblclick", () => {
                editingTodo?.toggleEditStatus();
                todo.toggleEditStatus();
                this.render();
            });

            buttonsDelete[index].addEventListener("click", () => {
                this.remove(todo.id);
            });

            checkboxesStatus[index].addEventListener("change", () => {
                todo.toggleStatus();
                this.render();
            });
        });
    }

    renderControlElements(){
        if(this.list.length) {
            this.bottomMenu.style.display = "flex";
            this.btnToggleAll.style.visibility = "visible";
            if(this.list.filter(todo => todo.isCompleted).length === this.list.length) {
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
