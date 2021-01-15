class API {
  constructor() {
    this.error = null;
    this.data = null;
  }

  clearData() {
    this.error = null;
    this.data = null;
  }

  async getData(url, method, headers, body) {
    this.clearData();

    const response = await fetch(`http://localhost:3001${url}`, {
      method: method,
      headers: headers,
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if(response.ok) {
      this.data = data;
    }
    else {
      this.error = data.message;
    }
  }
}
