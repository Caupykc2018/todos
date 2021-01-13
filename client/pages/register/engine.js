class Engine {
  constructor() {
    this.inputLogin = document.getElementById("input_login");
    this.inputPassword = document.getElementById("input_password");
    this.inputRepeatPassword = document.getElementById("input_repeat_password");
    this.submitButton = document.getElementById("submit_button");

    this.store = new Store();
    this.connector = new Connector(this.store, this);

    this.dispatch = this.connector.useDispatch();
  }

  async register(login, password) {
    const response = await fetch("http://localhost:3001/api/register", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login: login,
        password: password
      })
    });

    const data = await response.json();

    if(response.ok) {
      this.dispatch({action: "SET_CURRENT_USER", payload: {user: data}});
    }
    else {
      alert(data.message);
    }
  }

  render() {
    this.currentUser = this.connector.useSelector(state => state.currentUser);

    if(this.currentUser.id) {
      window.location.href = "../../../../client/pages/todos";
    }
  }

  init() {
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
