class Engine {
  constructor() {
    this.inputLogin = document.getElementById("input_login");
    this.inputPassword = document.getElementById("input_password");
    this.inputRepeatPassword = document.getElementById("input_repeat_password");
    this.submitButton = document.getElementById("submit_button");

    this.store = new Store(() => undefined);
  }

  init() {
    this.submitButton.addEventListener("click", () => {
      if(!this.inputLogin.value) {
        return alert("Login field is empty");
      }

      if(!this.inputPassword.value) {
        return alert("Password field is empty");
      }

      if(!this.inputRepeatPassword.value) {
        return alert("Repeat password field is empty");
      }

      this.store.getStore().users.forEach(user => {
        if(user.login === this.inputLogin.value) {
          return alert("This login is exist");
        }
      });

      if(this.inputPassword.value !== this.inputRepeatPassword.value) {
        return alert("Passwords don't match");
      }

      this.store.dispatch("REGISTER", {user: new User(this.inputLogin.value, this.inputPassword.value)});
      window.location.href = "../../../todos/pages/todos";
    });
  }
}

window.onload = () => {
  const engine = new Engine();
  engine.init();
}
