// /utils/dbStorage.ts

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

class DBStorage {
  private baseURL = "https://dbstorage.onrender.com"; // <-- change to your backend
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private storeTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;

    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
    }
  }

  private loadTokens() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken");
      this.refreshToken = localStorage.getItem("refreshToken");
    }
  }

  async signin(id: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${this.baseURL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Login failed");

    this.storeTokens(data.accessToken, data.refreshToken);
    return data;
  }

  private async refreshAuth() {
    const res = await fetch(`${this.baseURL}/auth/refreshtoken`, {
      method: "POST",
      body: JSON.stringify({ token: localStorage.getItem("refreshToken") }),
      headers: {
        Authorization: "Bearer " + this.accessToken || "",
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error("Refresh token invalid");

    this.storeTokens(data.accessToken, data.refreshToken);
  }

  async signup(
    id: string,
    password: string,
    contact: Array<{ name: string; value: string }>,
    access: any
  ) {
    console.log(access);
    const res = await fetch(`${this.baseURL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password, contact, access }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Signup failed");

    // If your server returns tokens after signup:
    if (data.accessToken && data.refreshToken) {
      this.storeTokens(data.accessToken, data.refreshToken);
    }

    return data;
  }

  private async authFetch(path: string, options: RequestInit = {}): Promise<any> {
    this.loadTokens();

    const res = await fetch(`${this.baseURL}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: "Bearer " + this.accessToken || "",
        "Content-Type": "application/json",
      },
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      await this.refreshAuth();
      return this.authFetch(path, options);
    } else if (!res.ok && (data as any)?.message) {
      throw new Error((data as any).message || "Request failed");
    }

    return data;
  }

  // --------------------------------------------------
  // ========== DATA STORAGE (existing) ===============
  // --------------------------------------------------

  async setItem(
    app: string | string[],
    collectionName: string | string[],
    collectionKey: string | string[],
    key: string | string[],
    value: any
  ) {
    const data = await this.authFetch("/setItem", {
      method: "POST",
      body: JSON.stringify({ app, collectionName, collectionKey, key, value }),
    });

    return data;
  }

  async getItem(
    app: string | string[] | null,
    collectionName: string | string[] | null,
    collectionKey: string | string[] | null,
    key: string | string[] | null,
    value: any | null
  ) {
    const data = await this.authFetch("/getItem", {
      method: "POST",
      body: JSON.stringify({ app, collectionName, collectionKey, key, value }),
    });

    return data;
  }

  async removeItem(
    app: string | string[] | null,
    collectionName: string | string[] | null,
    collectionKey: string | string[] | null,
    key: string | string[] | null,
    value: any | null
  ) {
    const data = await this.authFetch("/removeItem", {
      method: "POST",
      body: JSON.stringify({ app, collectionName, collectionKey, key, value }),
    });

    return data;
  }

  // --------------------------------------------------
  // ============= USER MANAGEMENT ====================
  // Based on uploaded backend functions
  // --------------------------------------------------

  // READ FULL USER
  async readUser() {
    const data = await this.authFetch("/user/read", { method: "GET" });
    return data;
  }

  // READ ONLY ID
  async readId() {
    const data = await this.authFetch("/user/read-id", { method: "GET" });
    return data;
  }

  // READ CONTACT LIST
  async readContact() {
    const data = await this.authFetch("/user/read-contact", { method: "GET" });
    return data;
  }

  // READ ACCESS RULES
  async readAccess() {
    const data = await this.authFetch("/user/read-access", { method: "GET" });
    return data;
  }

  // UPDATE USER ID
  async updateId(newId: string) {
    const data = await this.authFetch("/user/update-id", {
      method: "PUT",
      body: JSON.stringify({ newId }),
    });
    return data;
  }

  // UPDATE PASSWORD
  async updatePassword(newPassword: string) {
    const data = await this.authFetch("/user/update-password", {
      method: "PUT",
      body: JSON.stringify({ newPassword }),
    });
    return data;
  }

  // ADD CONTACT
  async addContact(name: string, value: string | number) {
    const data = await this.authFetch("/user/contact-add", {
      method: "POST",
      body: JSON.stringify({ name, value }),
    });
    return data;
  }

  // REMOVE CONTACT
  async removeContact(params: { name?: string; value?: string | number }) {
    const data = await this.authFetch("/user/contact-remove", {
      method: "POST",
      body: JSON.stringify(params),
    });
    return data;
  }

  // ADD ACCESS RULE
  async addAccess(accessEntry: [string, string | null, string | null, string[]]) {
    const data = await this.authFetch("/user/access-add", {
      method: "POST",
      body: JSON.stringify({ accessEntry }),
    });
    return data;
  }

  // REMOVE ACCESS
  async removeAccess(accessEntry: [string, string | null, string | null, string[]]) {
    const data = await this.authFetch("/user/access-remove", {
      method: "POST",
      body: JSON.stringify({ accessEntry }),
    });
    return data;
  }

  // DELETE ACCOUNT
  async deleteAccount() {
    const data = await this.authFetch("/user/delete-account", {
      method: "DELETE",
    });
    return data;
  }
}

const dbStorage = new DBStorage();
export default dbStorage;
