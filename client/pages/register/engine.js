class Engine {
  constructor() {
    this.inputLogin = document.getElementById("input_login");
    this.inputPassword = document.getElementById("input_password");
    this.inputRepeatPassword = document.getElementById("input_repeat_password");
    this.submitButton = document.getElementById("submit_button");

    this.store = new Store();
    this.connector = new Connector(this.store, this);
    
    this.api = new API();

    this.dispatch = this.connector.useDispatch();
  }

  async register(login, password) {
    await this.api.query(
      "/api/register",
      "POST",
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      {
        login: login,
        password: password
      }
    );

    if(this.api.data !== null) {
      this.dispatch({action: "SET_CURRENT_USER", payload: {user: this.api.data}});
    }
    else {
      alert(this.api.error);
    }
  }

  render() {
    this.currentUser = this.connector.useSelector(state => state.currentUser);

    if(this.currentUser.login) {
      window.location.href = "/client/pages/todos";
    }
  }

  init() {
    this.currentUser = this.connector.useSelector(state => state.currentUser);

    if(this.currentUser.login) {
      window.location.href = "/client/pages/todos";
    }

    this.submitButton.addEventListener("click", async () => {
      if(!this.inputLogin.value) {
        return alert("Login field is empty");
      }

      if(!this.inputPassword.value) {
        return alert("Password field is empty");
      }

      if(!this.inputRepeatPassword.value) {
        return alert("Repeat password field is empty");
      }

      await this.register(this.inputLogin.value, this.inputPassword.value);
    });
  }
}

window.onload = () => {
  const engine = new Engine();
  engine.init();
}
