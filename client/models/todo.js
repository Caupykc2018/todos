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
    }


}
