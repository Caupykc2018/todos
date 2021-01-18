class Engine {
  constructor() {
    this.usersContainer = document.getElementsByClassName("users")[0];
    this.login = document.getElementById("display_name");
    this.btnLogOut = document.getElementById("log_out");

    this.store = new Store();
    this.connector = new Connector(this.store, this);

    this.api = new API();

    this.dispatch = this.connector.useDispatch();
  }

  async refreshToken() {
    await this.api.query(
      "/api/refresh-token",
      "POST",
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      {
        refreshToken: this.currentUser.refreshToken
      }
    );

    if(this.api.data) {
      this.dispatch({action: "SET_TOKENS_USER", payload: {user: this.api.data}});
    }
    else {
      if(this.api.error.status === 403) {
        window.location.href = "/todos";
      }
      else if(this.api.error.status === 401) {
        this.dispatch({action: "LOG_OUT"});
      }
    }
  }

  async getAllUsers() {
    await this.api.query(
      "/api/users",
      "GET",
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.currentUser.token
      }
    );

    if(this.api.data) {
      this.dispatch({action: "INITIAL_USERS", payload: {users: this.api.data}});
    }
    else {
      if(this.api.error.status === 403) {
        window.location.href = "/todos";
      }
      alert(this.api.error.message);
    }
  }

  async editRoleUser(userId, role) {
    await this.api.query(
      `/api/users/${userId}`,
      "PUT",
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.currentUser.token
      },
      {
        role: role
      }
    );

    if(this.api.data) {
      this.dispatch({action: "SET_USER", payload: {user: this.api.data}});
    }
    else {
      alert(this.api.error.message);
    }
  }

  async editActiveUser(userId, isActive) {
    await this.api.query(
      `/api/users/${userId}`,
      "PUT",
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.currentUser.token
      },
      {
        isActive: isActive
      }
    );

    if(this.api.data) {
      this.dispatch({action: "SET_USER", payload: {user: this.api.data}});
    }
    else {
      alert(this.api.error.message);
    }
  }

  async deleteUser(userId) {
    await this.api.query(
      `/api/users/${userId}`,
      "DELETE",
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.currentUser.token
      }
    );

    if(this.api.data) {
      this.dispatch({action: "REMOVE_USER", payload: {user: this.api.data}});
    }
    else {
      alert(this.api.error.message);
    }
  }

  createViewUser(user) {
    const container = document.createElement("div");
    container.className = "user_container";

    const loginContainer = document.createElement("div");
    loginContainer.className = "user_login_container";

    const statusContainer = document.createElement("div");
    statusContainer.className = "user_status_container";

    const roleContainer = document.createElement("div");
    roleContainer.className = "user_role_container";

    const deleteContainer = document.createElement("div");
    deleteContainer.className = "user_delete_container";

    const login = document.createElement("p");
    login.appendChild(document.createTextNode(user.login));

    const status = document.createElement("input");
    status.type = "checkbox";
    status.id = `user_status_${user._id}`;
    status.className = "user_status_checkbox";
    status.checked = user.isActive;

    if(this.currentUser.login === user.login) {
      status.disabled = true;
    }
    else {
      status.addEventListener("change", async () => {
        await this.editActiveUser(user._id, !user.isActive);
      })
    }

    const labelStatus = document.createElement("label");
    labelStatus.setAttribute("for", `user_status_${user._id}`);
    labelStatus.className = "user_status_label";

    const userRole = document.createElement("div");
    userRole.className = "user_role";

    const currentRole = document.createElement("p");
    currentRole.className = "current_role";
    currentRole.appendChild(document.createTextNode(user.role));

    const iconDown = document.createElement("i");
    iconDown.className = "fas fa-chevron-down icon_down";

    userRole.appendChild(currentRole);
    this.currentUser.login !== user.login && userRole.appendChild(iconDown);

    const listUserRole = document.createElement("div");
    listUserRole.className = "list_user_role";

    const userRoles = ["user", "admin"];

    userRoles.forEach(role => {
      const buttonRole = document.createElement("button");
      buttonRole.className = "role";
      buttonRole.appendChild(document.createTextNode(role))

      if(role === user.role) {
        buttonRole.disabled = true;
      }
      else {
        buttonRole.addEventListener("click", async () => {
          await this.editRoleUser(user._id, role);
        });
      }

      listUserRole.appendChild(buttonRole);
    });

    const userDelete = document.createElement("button");
    userDelete.className = "user_delete";
    userDelete.appendChild(document.createTextNode("Delete"));
    userDelete.addEventListener("click", async () => {
      await this.deleteUser(user._id);
    });

    userRole.appendChild(login);

    loginContainer.appendChild(login);

    statusContainer.appendChild(status);
    statusContainer.appendChild(labelStatus);

    roleContainer.appendChild(userRole);
    this.currentUser.login !== user.login && roleContainer.appendChild(listUserRole);

    this.currentUser.login !== user.login && deleteContainer.appendChild(userDelete);

    container.appendChild(loginContainer);
    container.appendChild(statusContainer);
    container.appendChild(roleContainer);
    container.appendChild(deleteContainer);

    return container;
  }

  async init() {
    this.currentUser = this.connector.useSelector(state => state.currentUser);

    this.login.appendChild(document.createTextNode(this.currentUser.login));

    this.btnLogOut.addEventListener("click", () => {
      this.dispatch({action: "LOG_OUT"});
    })

    await this.refreshToken();

    await this.getAllUsers();


    setInterval(async () => {
      await this.refreshToken(); 
      await this.getAllUsers()
    }, 60000);

  }

  render() {
    this.currentUser = this.connector.useSelector(state => state.currentUser);
    this.users = this.connector.useSelector(state => state.users);

    if(!this.currentUser.login) {
      window.location.href = "/login";
    }

    this.usersContainer.innerHTML = "";

    this.users.forEach(user => this.usersContainer.appendChild(this.createViewUser(user)));
  }
}

window.onload = async () => {
  const engine = new Engine();
  await engine.init();
}
