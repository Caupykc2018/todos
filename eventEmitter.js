class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(name, listener) {
        if(!this.events[name]) {
            this.events[name] = [];
        }

        this.events[name].push(listener);
    }

    emit(name, data) {
        if(!this.events[name]){
            throw new Error(`Event "${name}" doesn't exist`);
        }

        this.events[name].forEach((callback) => callback(data));
    }
}