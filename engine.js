class Engine {
    constructor() {
        this.inputTitle = document.getElementById("inputTitle");
        this.btnAll = document.getElementById("btnAll");
        this.btnActive = document.getElementById("btnActive");
        this.btnCompleted = document.getElementById("btnCompleted");
        this.textCount = document.getElementById("count");
        this.btnClearCompleted = document.getElementById("btnClearCompleted");
        this.btnToggleAll = document.getElementById("btnToggleAll");

        this.todoList = new TodoList(this.textCount, this.btnToggleAll);
        this.store = new Store(() => this.todoList.render());
        this.todoList.setStore(this.store);

        this.inputTitle.value = this.store.getStore().inputValue;

        this.eventEmmiter = new EventEmitter();
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
    }

    saveInputValue(value) {
        localStorage.setItem("input-value", {value: value});
    }

    init() {
        this.eventEmmiter.on("toggle-all", () => {
            this.todoList.toggleAll();
        });

        this.eventEmmiter.on("clear-completed", () => {
            this.todoList.clearCompleted();
        });

        this.eventEmmiter.on("toggle-tab", (data) => {
            this.toggleTab(data);
        });

        this.eventEmmiter.on("keypress-input", ({input, key}) => {
            if(!input.value.trim()) return;
            if(key === "Enter") {
                this.todoList.add(input.value.trim());
                input.value = "";
            }
        });

        const btnTabs = {};
        btnTabs[TABS.All] = this.btnAll;
        btnTabs[TABS.Active] = this.btnActive;
        btnTabs[TABS.Completed] = this.btnCompleted;

        this.eventEmmiter.emit("toggle-tab", {button: btnTabs[this.store.getStore().currentTab], tab: this.store.getStore().currentTab});

        this.btnToggleAll.addEventListener("click", () => this.eventEmmiter.emit("toggle-all"));
        this.btnClearCompleted.addEventListener("click", () => this.eventEmmiter.emit("clear-completed"));

        this.btnAll.addEventListener("click", () => this.eventEmmiter.emit("toggle-tab", {button: this.btnAll, tab: TABS.All}));
        this.btnActive.addEventListener("click", () => this.eventEmmiter.emit("toggle-tab", {button: this.btnActive, tab: TABS.Active}));
        this.btnCompleted.addEventListener("click", () => this.eventEmmiter.emit("toggle-tab", {button: this.btnCompleted, tab: TABS.Completed}));

        this.inputTitle.addEventListener("keypress", (e) => this.eventEmmiter.emit("keypress-input", {input: this.inputTitle, key: e.key}));
        this.inputTitle.addEventListener("input", (e) => this.store.dispatch("SET_INPUT_VALUE", {value: e.target.value}));

        this.todoList.render();
    }
}

