class User {
  constructor(login, password, id=new Date().getTime()) {
    this.login = login;
    this.password = password;
    this.id = id;
  }
}
