class Store {
    constructor() {
        const initialState = JSON.parse(localStorage.getItem("state")) || {};

        this.store = {
            currentTab: initialState.currentTab || {},
            todos: [],
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
                    const index = state.findIndex(todo => todo._id === payloadTodo._id);

                    state[index] = {
                        ...state[index], 
                        title: payloadTodo.title, 
                        isCompleted: payloadTodo.isCompleted
                    };
                });
                return state;
            case "REMOVE_TODO":
                return state.filter(todo => todo._id !== payload.todo._id);
            case "REMOVE_TODOS":
                let editListTodos = [...state];
                payload.todos.forEach(todo => {
                    editListTodos = editListTodos.filter(({_id}) => _id !== todo._id);
                })
                return editListTodos;
            case "TOGGLE_EDIT_STATUS_TODO":
                const index = state.findIndex(todo => todo._id === payload.id);
                state[index] = {
                    ...state[index], 
                    isEdit: !state[index].isEdit
                }
                return state;
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
