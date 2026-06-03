class Fetch {
  #main_url: string;
  #headers: Record<string, string>;

  constructor(main_url: string, headers: Record<string, string>) {
    this.#main_url = main_url;
    this.#headers = headers;
  }

  get main_url(): string {
    return this.#main_url;
  }

  set main_url(main_url: string) {
    this.#main_url = main_url;
  }

  get headers(): Record<string, string> {
    return this.#headers;
  }

  set headers(headers: Record<string, string>) {
    this.#headers = headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const url = this.#main_url + endpoint;
    const res = await fetch(url);
    return res.json() as Promise<T>;
  }

  async post<T, B>(endpoint: string, body: B): Promise<T> {
    const url = this.#main_url + endpoint;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json() as Promise<T>;
  }

  async put<T, B>(endpoint: string, body: B): Promise<T> {
    const url = this.#main_url + endpoint;
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json() as Promise<T>;
  }

  async patch<T, B>(endpoint: string, body: B): Promise<T> {
    const url = this.#main_url + endpoint;
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json() as Promise<T>;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = this.#main_url + endpoint;
    const res = await fetch(url, {
      method: "DELETE",
    });
    return res.json() as Promise<T>;
  }
}

export default Fetch;
