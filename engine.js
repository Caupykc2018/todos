class Engine {
    constructor() {
        this.todosContainer = document.getElementById("todos");
        this.inputTitle = document.getElementById("inputTitle");
        this.btnAll = document.getElementById("btnAll");
        this.btnActive = document.getElementById("btnActive");
        this.btnCompleted = document.getElementById("btnCompleted");
        this.textCount = document.getElementById("count");
        this.btnClearCompleted = document.getElementById("btnClearCompleted");
        this.btnToggleAll = document.getElementById("btnToggleAll");
        
        this.todoList = new TodoList(this.todosContainer, this.textCount);

    }

    toggleTab(currentBtn, tab) {
        const allBtn = [
            this.btnAll, 
            this.btnActive, 
            this.btnCompleted
        ].filter(btn => btn.id !== currentBtn.id);

        return () => {
            allBtn.forEach(btn => btn.classList.contains("current_btn") && btn.classList.toggle("current_btn"));
            currentBtn.classList.toggle("current_btn");
            this.todoList.switchViewList(tab);
        }
    }

    init() {
        this.btnToggleAll.addEventListener("click", () => this.todoList.toggleAll());
        this.btnClearCompleted.addEventListener("click", () => this.todoList.clearCompleted());
    
        this.btnAll.addEventListener("click", this.toggleTab(btnAll, TABS.All));
        this.btnActive.addEventListener("click", this.toggleTab(btnAll, TABS.Active));
        this.btnCompleted.addEventListener("click", this.toggleTab(btnAll, TABS.Completed));

        this.inputTitle.addEventListener("keypress", (e) => {
            if(!this.inputTitle.value.trim()) return;
            if(e.key === "Enter") {
                this.todoList.add(this.inputTitle.value.trim());
                this.inputTitle.value = "";
            }
        });
    }
}
        
