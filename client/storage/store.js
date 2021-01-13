class Store {
    constructor() {
        const initialState = JSON.parse(localStorage.getItem("state")) || {};

        this.store = {
            currentTab: initialState.currentTab || {},
            todos: [],
            viewTodos: [],
            currentUser: initialState.currentUser || {}
        };
    }

    getStore() {
        return {...this.store};
    }

    reducerTodos(state, action, payload) {
        switch (action) {
            case "INITIAL_TODOS": {
                return payload.todos.map(todo => ({...todo, isEdit: false}))
            }
            case "ADD_TODO":
                return [...state, {...payload.todo, isEdit: false}];
            case "SET_TODO": 
                state[state.findIndex(todo => todo._id === payload.todo._id)] = {
                    ...payload.todo, 
                    title: payload.todo.title, 
                    isCompleted: payload.todo.isCompleted
                };
                return state;
            case "SET_TODOS":
                payload.todos.forEach(payloadTodo => {
                    state[state.findIndex(todo => todo._id === payloadTodo._id)] = {
                        ...payloadTodo, 
                        title: payloadTodo.title, 
                        isCompleted: payloadTodo.isCompleted
                    };
                });
            case "REMOVE_TODO":
                return state.filter(todo => todo._id !== payload.todo._id);
            case "TOGGLE_EDIT_STATUS_TODO":
                state.find(todo => todo._id === payload.id) = {
                    ...payload.todo, 
                    isEdit: payload.id
                }
            default:
                return state;
        }
    }

    reducerViewTodos(state, action, payload) {
        switch (action) {
            case "RELOAD_VIEW_TODOS":
                switch (this.store.currentTab[this.store.currentUser.id]) {
                    case TABS.All:
                        return [...this.store.todos];
                    case TABS.Active:
                        return this.store.todos.filter(todo => !todo.isCompleted);
                    case TABS.Completed:
                        return this.store.todos.filter(todo => todo.isCompleted);
                }
            default:
                return state;
        }
    }

    reducerCurrentTab(state, action, payload) {
        switch (action) {
            case "SET_TAB":
                return {
                    ...state,
                    [this.store.currentUser.id]: payload.tab
                };
            default:
                return state;
        }
    }

    reducerCurrentUser(state, action, payload) {
        switch (action) {
            case "SET_CURRENT_USER":
                return {
                    id: payload.user.id,
                    login: payload.user.login
                };

            case "LOG_OUT":
                return {}
            default:
                return state;
        }
    }

    reducer(state, action, payload) {
        return {
            ...state,
            currentTab: this.reducerCurrentTab(state.currentTab, action, payload),
            todos: this.reducerTodos(state.todos, action, payload),
            viewTodos: this.reducerViewTodos(state.viewTodos, action, payload),
            currentUser: this.reducerCurrentUser(state.currentUser, action, payload)
        }
    }

    dispatch(action, payload) {
        this.store = this.reducer(this.store, action, payload);

        this.save();
    }

    save() {
        localStorage.setItem("state", JSON.stringify({
            currentTab: this.store.currentTab, 
            currentUser: this.store.currentUser
        }));
    }
}
