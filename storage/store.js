class Store {
    constructor(render) {
        let todosStorage = JSON.parse(localStorage.getItem("todos"));
        let userStorage = JSON.parse(localStorage.getItem("users"));

        this.store = {
            currentTab: JSON.parse(localStorage.getItem("current-tab")) || {},
            todos: {},
            viewTodos: [],
            users: [],
            currentUser: JSON.parse(localStorage.getItem("current-user")) || {}
        };

        if(todosStorage) {
            Object.keys(todosStorage).forEach(key => todosStorage[key] = todosStorage[key].map(item => new Todo(item.title, item.id, item.isCompleted)));
            this.store.todos = todosStorage;
        }

        if(userStorage) {
            this.store.users = userStorage.map(item => new User(item.login, item.password, item.id));
        }

        this.render = render;

    }

    getStore() {
        return {...this.store};
    }

    reducer(action, payload) {
        switch (action) {
            case "ADD":
                return {
                    ...this.store,
                    todos: {
                        ...this.store.todos,
                        [this.store.currentUser.id]: [...this.store.todos[this.store.currentUser.id], payload.todo]
                    }
                };
            case "DELETE":
                return {
                    ...this.store,
                    todos: {
                        ...this.store.todos,
                        [this.store.currentUser.id]: this.store.todos[this.store.currentUser.id].filter(todo => todo.id !== payload.id )
                    }
                };
            case "EDIT":
                this.store.viewTodos[payload.index].title = payload.title;
                break;
            case "TOGGLE_STATUS":
                this.store.viewTodos[payload.index].isCompleted = !this.store.viewTodos[payload.index].isCompleted;
                break;
            case "TOGGLE_ALL_STATUS":
                const todosActive = this.store.todos[this.store.currentUser.id].filter(todo => !todo.isCompleted);

                if(todosActive.length) {
                    todosActive.forEach(todo => todo.isCompleted = !todo.isCompleted);
                }
                else {
                    this.store.todos[this.store.currentUser.id].forEach(todo => todo.isCompleted = !todo.isCompleted);
                }
                break;
            case "TOGGLE_EDIT":
                this.store.viewTodos[payload.index].isEdit = !this.store.viewTodos[payload.index].isEdit;
                break;
            case "CLEAR_COMPLETED":
                return {
                    ...this.store,
                    todos: {
                        ...this.store.todos,
                        [this.store.currentUser.id]: this.store.todos[this.store.currentUser.id].filter(todo => !todo.isCompleted)
                    }
                };
            case "RELOAD_VIEW_TODOS":
                switch (this.store.currentTab[this.store.currentUser.id]) {
                    case TABS.All:
                        return {
                            ...this.store,
                            viewTodos: [...this.store.todos[this.store.currentUser.id]]
                        };
                    case TABS.Active:
                        return {
                            ...this.store,
                            viewTodos: this.store.todos[this.store.currentUser.id].filter(todo => !todo.isCompleted)
                        };
                    case TABS.Completed:
                        return {
                            ...this.store,
                            viewTodos: this.store.todos[this.store.currentUser.id].filter(todo => todo.isCompleted)
                        };
                }
            case "SET_TAB":
                return {
                    ...this.store,
                    currentTab: {
                        ...this.store.currentTab,
                        [this.store.currentUser.id]: payload.tab
                    }
                };
            case "REGISTER":
                return {
                    ...this.store,
                    users: [...this.store.users, payload.user],
                    todos: {...this.store.todos, [payload.user.id]: []},
                    currentUser: {id: payload.user.id, login: payload.user.login},
                    currentTab: {
                        ...this.store.currentTab,
                        [payload.user.id]: TABS.All
                    }
                };
            case "LOGIN":
                return {
                    ...this.store,
                    currentUser: {id: payload.user.id, login: payload.user.login}
                };
            case "LOG_OUT":
                return {
                  ...this.store,
                  currentUser: {}
                };
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
        localStorage.setItem("users", JSON.stringify(this.store.users));
        localStorage.setItem("current-tab", JSON.stringify(this.store.currentTab));
        localStorage.setItem("current-user", JSON.stringify(this.store.currentUser));
    }
}
