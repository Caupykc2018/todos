class Todo {
    constructor(listRenderElement, title) {
        this.id = new Date().getTime();
        this.title = title;
        this.isCompleted = false;
        this.isEdit = false;
        this.listRenderElement = listRenderElement;
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
        checkboxContainer.className = "todo_checkbox";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = this.isCompleted;
        checkbox.className = "checkbox_status";

        const titleContainer = document.createElement("div");

        const title = document.createElement("p");

        const inputContainer = document.createElement("div");
        inputContainer.style.width = "100%";

        const inputEditTitle = document.createElement("input");
        inputEditTitle.id = "input_edit";
        inputEditTitle.style.outline = 0;
        inputEditTitle.style.fontSize = 15;
        inputEditTitle.style.border = 0;
        inputEditTitle.type = "text";
        inputEditTitle.value = this.title;

        const btnDeleteContainer = document.createElement("div");
        btnDeleteContainer.style.display = "none";

        const btnDelete = document.createElement("button");
        btnDelete.id = this.id.toString();

        btnDelete.className = "btn_delete";

        const btnIcon = document.createElement("i");
        btnIcon.className = "fa fa-times";

        btnDelete.appendChild(btnIcon);

        const flexBoxLeftContainer = document.createElement("div");
        const flexBoxRightContainer = document.createElement("div");

        title.appendChild(document.createTextNode(this.title));

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