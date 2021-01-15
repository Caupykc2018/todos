class API {
  constructor() {
    this.error = null;
    this.data = null;
  }

  clearData() {
    this.error = null;
    this.data = null;
  }

  async query(url = "/", method = "GET", headers = {}, body = null) {
    this.clearData();

    const response = await fetch(`http://localhost:3001${url}`, {
      method: method,
      headers: headers,
      credentials: 'include',
      body: body && JSON.stringify(body)
    });

    const data = await response.json();

    if(response.ok) {
      this.data = data;
    }
    else {
      this.error = {message: data.message, status: response.status};
    }
  }

  
}
