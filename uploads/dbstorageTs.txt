// /utils/dbStorage.ts

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

class DBStorage {
  //For deployment
  private baseURL = "https://dbstorage.onrender.com";
  //For testing
  //private baseURL = "http://localhost:10000";
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

  async signup(
    id: string,
    password: string,
    role: string[] | null = null,
    contact: Array<{ key: string; value: string }> | null = null
  ) {
    console.log(role);
    const res = await fetch(`${this.baseURL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password, role, contact }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Signup failed");

    // If your server returns tokens after signup:
    if (data.accessToken && data.refreshToken) {
      this.storeTokens(data.accessToken, data.refreshToken);
    }
    return data;
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
    const res = await fetch(`${this.baseURL}/auth/refreshToken`, {
      method: "POST",
      body: JSON.stringify({ token: this.refreshToken }),
      headers: {
        Authorization: "Bearer " + this.accessToken || "",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error("Refresh token invalid");
    this.storeTokens(data.accessToken, data.refreshToken);
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
    if (data.accessToken && data.refreshToken) {
      //alert("Storing new tokens from authFetch");
      this.storeTokens(data.accessToken, data.refreshToken);
    }
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
    value: any,
    getAccess: string[],
    setAccess: string[],
    removeAccess: string[]
  ) {
    const data = await this.authFetch("/setItem", {
      method: "POST",
      body: JSON.stringify({ app, collectionName, collectionKey, key, value, getAccess, setAccess, removeAccess }),
    });

    return data;
  }

  async getItem(
    app: string | string[] | null,
    collectionName: string | string[] | null,
    collectionKey: string | string[] | null,
    key: string | string[] | null,
    value: any | null,
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
  // ============= JSON STORAGE =======================
  // --------------------------------------------------
  private JSONData: JSON = {} as JSON;

  async loadJSONData(app: string, collectionName: string, collectionKey: string, key: string, value: any) {
    const data = await this.getItem(app, collectionName, collectionKey, key, value);
    if (data === null) {
      this.JSONData = {} as JSON;
      return;
    }
    this.JSONData = JSON.parse(data[app][collectionName][key] || "{}");
    //alert("Loaded JSON Data: " + JSON.stringify(this.JSONData));
  }
  async storeJSONData(app: string, collectionName: string, collectionKey: string, key: string, value: any, setAccess: string[], getAccess: string[], removeAccess: string[]) {
    await this.setItem(app, collectionName, collectionKey, key, JSON.stringify(this.JSONData), setAccess, getAccess, removeAccess);
  }

  getJSONData<T = any>(): T {
    return this.JSONData as T;
  }

  setJSONData(newData: JSON) {
    this.JSONData = newData;
  }

  pushJSONData(path: string[], value: any): void {
    // Clone path to avoid mutating the original array passed as an argument
    const keys = [...path];
    const lastKey = keys.pop();
    if (!lastKey) return;

    let current = this.JSONData as any;

    // Traverse the path, creating objects if they don't exist
    for (const key of keys) {
      if (current[key] === undefined || current[key] === null) {
        current[key] = {};
      }
      current = current[key];
    }

    // Ensure the target property is an array
    if (!Array.isArray(current[lastKey])) {
      current[lastKey] = [];
    }

    current[lastKey].push(value);
  }

  popJSONData(path: string[], findFn: (item: any) => boolean): any | null {
  const keys = [...path];
  const lastKey = keys.pop();
  if (!lastKey) return null;

  let current = this.JSONData as any;

  // Traverse to find the parent object
  for (const key of keys) {
    if (current[key] === undefined || current[key] === null) {
      return null;
    }
    current = current[key];
  }

  const targetArray = current[lastKey];

  // If it's an array, find the index of the specific item
  if (Array.isArray(targetArray)) {
    const index = targetArray.findIndex(findFn);
    
    if (index !== -1) {
      // splice(index, 1) removes the item and returns an array containing it
      return targetArray.splice(index, 1)[0];
    }
  }

  return null;
}

  updateJSONData(path: string[], findFn: (item: any) => boolean, newValue: any): void {
    const keys = [...path];
    const lastKey = keys.pop();
    if (!lastKey) return;

    let current = this.JSONData as any;

    // Traverse to find the parent object
    for (const key of keys) {
      if (current[key] === undefined || current[key] === null) return;
      current = current[key];
    }

    const targetArray = current[lastKey];

    if (Array.isArray(targetArray)) {
      const index = targetArray.findIndex(findFn);
      if (index !== -1) {
        // Merge existing item with new values (like completed: true)
        targetArray[index] = { ...targetArray[index], ...newValue };
      }
    }
  }





  // --------------------------------------------------
  // ============= USER MANAGEMENT ====================
  // Based on uploaded backend functions
  // --------------------------------------------------
  async getSelfId<T = any>() {
    const data = await this.authFetch("/user/getSelfId", {
      method: "GET",
    });
    return data as T;
  }

  //not yet available
  async setSelfId(id: string) {
    const data = await this.authFetch("/user/setSelfId", {
      method: "PUT",
      body: JSON.stringify({ id: id }),
    });
    return data;
  }

  async setSelfPassword(password: string) {
    const data = await this.authFetch("/user/setSelfPassword", {
      method: "PUT",
      body: JSON.stringify({ password: password }),
    });
    return data;
  }

  //------------------------------------------------
  //=========== Artificial Intelligence ============
  //------------------------------------------------
  async aiTXTGenerator<T = any>(msg: String, context: String) {
    const data = await this.authFetch("/process/generator/aiTXTGenerator", {
      method: "POST",
      body: JSON.stringify({ msg: msg, context: context }),
    });
    return data as T;
  }

  async aiJSONGenerator<T = any>(msg: JSON) {
    const data = await this.authFetch("/process/generator/aiJSONGenerator", {
      method: "POST",
      body: JSON.stringify(msg),
    });
    return data as T;
  }
}

const dbStorage = new DBStorage();
export default dbStorage;
