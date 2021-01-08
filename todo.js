class Todo {
    constructor( 
        title, 
        id = new Date().getTime(), 
        isCompleted = false
    ) {
        this.id = id;
        this.title = title;
        this.isCompleted = isCompleted;
        this.isEdit = false;
        this.listRenderElement = document.getElementById("todos");
    }

    edit(title) {
        this.title = title;
        this.toggleEditStatus();
    }

    toggleStatus() {
        this.isCompleted = !this.isCompleted;
    }

    toggleEditStatus() {
        this.isEdit = !this.isEdit;
    }

    render() {
        const container = document.createElement("div");
        container.className = "todo";

        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "todo_checkbox_container";

        const checkbox = document.createElement("input");
        checkbox.className = "checkbox_status";
        checkbox.type = "checkbox";
        checkbox.checked = this.isCompleted;

        if(this.isEdit) {
            checkbox.style.visibility = "hidden";
        }

        const titleContainer = document.createElement("div");
        titleContainer.className = "todo_title_container";

        const title = document.createElement("p");
        title.className = "todo_title";

        const inputContainer = document.createElement("div");
        inputContainer.className = "input_edit_container";

        const inputEditTitle = document.createElement("input");
        inputEditTitle.id = "input_edit";
        inputEditTitle.className = "input_edit";
        inputEditTitle.type = "text";
        inputEditTitle.value = this.title;

        const btnDeleteContainer = document.createElement("div");
        btnDeleteContainer.className = "btn_delete_container";
        btnDeleteContainer.style.display = "none";

        const btnDelete = document.createElement("button");
        btnDelete.id = this.id.toString();
        btnDelete.className = "btn_delete";

        const btnIcon = document.createElement("i");
        btnIcon.className = "fa fa-times";

        btnDelete.appendChild(btnIcon);

        const flexBoxLeftContainer = document.createElement("div");
        flexBoxLeftContainer.className = "todo_left_flexbox";

        const flexBoxRightContainer = document.createElement("div");
        flexBoxRightContainer.className = "todo_right_flexbox";

        title.appendChild(document.createTextNode(this.title));

        if(this.isCompleted) {
            title.style.textDecoration = "line-through";
            title.style.color = "lightgray";
        }

        !this.isEdit && titleContainer.appendChild(title);

        inputContainer.appendChild(inputEditTitle);

        checkboxContainer.appendChild(checkbox);

        btnDeleteContainer.appendChild(btnDelete);

        flexBoxLeftContainer.appendChild(checkboxContainer);
        flexBoxLeftContainer.appendChild(!this.isEdit ? titleContainer : inputContainer);

        flexBoxRightContainer.appendChild(btnDeleteContainer);

        container.appendChild(flexBoxLeftContainer);
        container.appendChild(flexBoxRightContainer);

        !this.isEdit && container.addEventListener("mouseover", () => {
            btnDeleteContainer.style.display = "flex";
        });

        !this.isEdit && container.addEventListener("mouseout", () => {
            btnDeleteContainer.style.display = "none";
        });

        this.listRenderElement.appendChild(container);
    }
}
