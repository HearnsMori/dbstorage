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
        const res = await fetch(`${this.baseURL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                refreshAuth: this.refreshToken || "",
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
        access: Array<[string, string | null, string | null, string[]]>
    ) {
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
                Authorization: this.accessToken || "",
                "Content-Type": "application/json",
            },
        });

        if (res.status === 401) {
            await this.refreshAuth();
            return this.authFetch(path, options);
        }

        return res;
    }

    // --------------------------------------------------
    // ========== DATA STORAGE (existing) ===============
    // --------------------------------------------------

    async setItem(
        app: string,
        collectionName: string,
        collectionKey: string,
        key: string,
        value: string | number | object
    ) {
        const res = await this.authFetch("/data/setItem", {
            method: "POST",
            body: JSON.stringify({ app, collectionName, collectionKey, key, value }),
        });

        return res.json();
    }

    async getItem(
        app: string,
        collectionName: string,
        collectionKey: string,
        key: string
    ) {
        const res = await this.authFetch("/data/getItem", {
            method: "POST",
            body: JSON.stringify({ app, collectionName, collectionKey, key }),
        });

        return res.json();
    }

    async removeItem(
        app: string,
        collectionName: string,
        collectionKey: string,
        key: string
    ) {
        const res = await this.authFetch("/data/removeItem", {
            method: "POST",
            body: JSON.stringify({ app, collectionName, collectionKey, key }),
        });

        return res.json();
    }

    // --------------------------------------------------
    // ============= USER MANAGEMENT ====================
    // Based on uploaded backend functions
    // --------------------------------------------------

    // READ FULL USER
    async readUser() {
        const res = await this.authFetch("/user/read", { method: "GET" });
        return res.json();
    }

    // READ ONLY ID
    async readId() {
        const res = await this.authFetch("/user/read-id", { method: "GET" });
        return res.json();
    }

    // READ CONTACT LIST
    async readContact() {
        const res = await this.authFetch("/user/read-contact", { method: "GET" });
        return res.json();
    }

    // READ ACCESS RULES
    async readAccess() {
        const res = await this.authFetch("/user/read-access", { method: "GET" });
        return res.json();
    }

    // UPDATE USER ID
    async updateId(newId: string) {
        const res = await this.authFetch("/user/update-id", {
            method: "POST",
            body: JSON.stringify({ newId }),
        });
        return res.json();
    }

    // UPDATE PASSWORD
    async updatePassword(newPassword: string) {
        const res = await this.authFetch("/user/update-password", {
            method: "POST",
            body: JSON.stringify({ newPassword }),
        });
        return res.json();
    }

    // ADD CONTACT
    async addContact(name: string, value: string | number) {
        const res = await this.authFetch("/user/contact-add", {
            method: "POST",
            body: JSON.stringify({ name, value }),
        });
        return res.json();
    }

    // REMOVE CONTACT
    async removeContact(params: { name?: string; value?: string | number }) {
        const res = await this.authFetch("/user/contact-remove", {
            method: "POST",
            body: JSON.stringify(params),
        });
        return res.json();
    }

    // ADD ACCESS RULE
    async addAccess(accessEntry: [string, string | null, string | null, string[]]) {
        const res = await this.authFetch("/user/access-add", {
            method: "POST",
            body: JSON.stringify({ accessEntry }),
        });
        return res.json();
    }

    // REMOVE ACCESS
    async removeAccess(accessEntry: [string, string | null, string | null, string[]]) {
        const res = await this.authFetch("/user/access-remove", {
            method: "POST",
            body: JSON.stringify({ accessEntry }),
        });
        return res.json();
    }

    // DELETE ACCOUNT
    async deleteAccount() {
        const res = await this.authFetch("/user/delete-account", {
            method: "POST",
        });
        return res.json();
    }
}

const dbStorage = new DBStorage();
export default dbStorage;
