class Store {
    constructor() {
        const initialState = JSON.parse(localStorage.getItem("state")) || {};

        this.store = {
            currentTab: initialState.currentTab || {},
            todos: [],
            users: [],
            currentUser: initialState.currentUser || {}
        };
    }

    getStore() {
        return {...this.store};
    }

    reducerTodos(state, action, payload) {
        switch (action) {
            case "INITIAL_TODOS":
                return payload.todos.map(todo => ({...todo, isEdit: false}))
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

    reducerUsers(state, action, payload) {
        switch (action) {
            case "INITIAL_USERS":
                console.log(payload.users);
                return payload.users;
            case "ADD_USER":
                return [...state, payload.user];
            case "SET_USER":
                state[state.findIndex(user => user._id === payload.user._id)] = {
                    ...payload.user,
                    isActive: payload.user.isActive,
                    role: payload.user.role
                };
                return state;
            case "REMOVE_USER":
                return state.filter(user => user._id !== payload.user._id);
            default:
                return state;
        }
    }

    reducerCurrentTab(state, action, payload) {
        switch (action) {
            case "SET_TAB":
                return {
                    ...state,
                    [this.store.currentUser.login]: payload.tab
                };
            default:
                return state;
        }
    }

    reducerCurrentUser(state, action, payload) {
        switch (action) {
            case "SET_CURRENT_USER":
                return {
                    token: payload.user.token,
                    refreshToken: payload.user.refreshToken,
                    login: payload.user.login,
                    role: payload.user.role
                };
            case "SET_TOKENS_USER":
                return {
                    ...state,
                    token: payload.user.token,
                    refreshToken: payload.user.refreshToken
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
            users: this.reducerUsers(state.users, action, payload),
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
