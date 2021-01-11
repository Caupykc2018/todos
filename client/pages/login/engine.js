class Engine {
  constructor() {
    this.inputLogin = document.getElementById("input_login");
    this.inputPassword = document.getElementById("input_password");
    this.submitButton = document.getElementById("submit_button");

    this.store = new Store();
    this.connector = new Connector(this.store, this);

    this.dispatch = this.connector.useDispatch();
    this.users = this.connector.useSelector(state => state.users);
  }

  render() {

  }

  init() {
    this.submitButton.addEventListener("click", () => {
      if(!this.inputLogin.value) {
        return alert("Login field is empty");
      }

      if(!this.inputPassword.value) {
        return alert("Password field is empty");
      }

      let currentUser;

      try{
        this.users.forEach(user => {
          if(user.login === this.inputLogin.value) {
            if(user.password === this.inputPassword.value) {
              currentUser = user;
            }
            else {
              throw {};
            }
          }
        });
      }
      catch (e) {

      }

      if(!currentUser) {
        return alert("Incorrect login or password");
      }

      this.dispatch({action:"LOGIN", payload: {user: currentUser}});
      window.location.href = "../../../pages/todos";
    });
  }
}

window.onload = () => {
  const engine = new Engine();
  engine.init();
}
