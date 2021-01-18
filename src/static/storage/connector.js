class Connector {
    constructor(store, engine) {
        this.store = store;
        this.engine = engine;
    }

    useSelector(callback) {
        return callback(this.store.getStore());
    }

    useDispatch() {
        return ({action, payload}) => {
            this.store.dispatch(action, payload);
            this.engine.render();
        }
    }
}