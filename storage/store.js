class Store {
    constructor(render) {
        let todosStorage = JSON.parse(localStorage.getItem("todos"));
        this.store = {
            inputValue: localStorage.getItem("input-value") || "",
            currentTab: localStorage.getItem("current-tab") || TABS.All
        };
        if(todosStorage) {
            this.store.todos = todosStorage.map(item => new Todo(item.title, item.id, item.isCompleted));
        }
        else{
            this.store.todos = [];
        }
        this.render = render;
    }

    getStore() {
        return {...this.store};
    }

    reducer(action, payload) {
        switch (action) {
            case "ADD":
                return {...this.store, todos: [...this.store.todos, payload.todo]};
            case "DELETE":
                return {...this.store, todos: this.store.todos.filter(todo => todo.id !== payload.id)};
            case "EDIT":
                this.store.todos[payload.index].edit(payload.title);
                break;
            case "TOGGLE_STATUS":
                this.store.todos[payload.index].toggleStatus();
                break;
            case "TOGGLE_ALL_STATUS":
                const todosActive = this.store.todos.filter(todo => !todo.isCompleted);

                if(todosActive.length) {
                    todosActive.forEach(todo => todo.toggleStatus());
                }
                else {
                    this.store.todos.forEach(todo => todo.toggleStatus());
                }
                break;
            case "TOGGLE_EDIT":
                this.store.todos[payload.index].toggleEditStatus();
                break;
            case "CLEAR_COMPLETED":
                return {...this.store, todos: this.store.todos.filter(todo => !todo.isCompleted)};
            case "SET_TAB": 
                return {...this.store, currentTab: payload.tab};
            case "SET_INPUT_VALUE":
                return {...this.store, inputValue: payload.value}
            default:
                return this.store
        }
        return this.store;
    }

    dispatch(action, payload) {
        this.store = this.reducer(action, payload);

        this.save();
        this.render();
    }

    save() {
        localStorage.setItem("todos", JSON.stringify(this.store.todos));
        localStorage.setItem("input-value", this.store.inputValue);
        localStorage.setItem("current-tab", this.store.currentTab);
    }
}