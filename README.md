# dbStorage
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/HearnsMori/dbstorage)

## Overview

dbStorage is a Node.js backend system designed to provide a database-backed storage solution, mirroring the simplicity of the browser's `localStorage` API but with the power of a persistent database. It is built for rapid frontend prototyping and testing, allowing developers to focus on the frontend logic by providing a flexible and abstracted storage backend.

The system features robust authentication, role-based access, and advanced query capabilities, including multi-value handling and wildcard queries. Operations like `setItem`, `getItem`, and `removeItem` can handle single values or arrays for powerful batch operations.

## Features

-   **JWT-based Authentication**: Secure user signup, signin, and session management using JSON Web Tokens (access and refresh tokens).
-   **Permission-Driven Access Control**: Fine-grained control over which users can perform `set`, `get`, and `remove` operations on specific data segments.
-   **localStorage-like API**: Familiar `setItem`, `getItem`, `removeItem` interface for ease of use.
-   **Bulk Operations**: Natively handles arrays as input for performing batch creates, updates, queries, and deletes in a single request.
-   **Advanced Query Logic**:
    -   **Broadcast Mode**: A single array in a query acts as an `$in` filter.
    -   **Zipping Mode**: Multiple arrays of the same length are "zipped" to create specific, index-matched queries.
-   **Structured JSON Output**: `getItem` returns data in a clean, nested JSON structure for easy consumption on the frontend.
-   **Secure and Robust**: Built with Helmet for security headers, rate-limiting to prevent abuse, and centralized error handling.

## Technology Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: JSON Web Token (jsonwebtoken), bcryptjs
-   **Security**: Helmet, express-rate-limit
-   **Middleware**: CORS, express-session

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

-   Node.js and npm
-   MongoDB instance (local or cloud-based)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/hearnsmori/dbstorage.git
    cd dbstorage
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the root of the project and add the following variables:

    ```env
    # Server Configuration
    PORT=3000

    # MongoDB Connection
    MONGO_URI=mongodb://localhost:27017/dbstorage

    # JWT & Session Secrets
    JWT_SECRET=YOUR_ACCESS_SECRET_KEY
    REFRESH_SECRET=YOUR_REFRESH_SECRET_KEY
    SECRETKEY=YOUR_EXPRESS_SESSION_SECRET

    # Special Operations
    CLEAR_ALL_KEY=YOUR_SECRET_PASSWORD_TO_CLEAR_DB
    ```

4.  **Start the server:**
    ```sh
    npm start
    ```
    The server will be running at `http://localhost:3000`.

## Client-Side Usage Example

To interact with the backend, you can create a client-side wrapper that mimics the `localStorage` API.

1.  **Create a utility file (e.g., `utils/dbStorage.js`):**

    ```javascript
    // Type definitions for clarity
    type Input = string | string[] | null | undefined;

    // Helper to normalize inputs before sending
    function normalize(value: Input) {
      if (value === null || value === undefined) return null;
      return Array.isArray(value) ? value : value;
    }

    async function send(action: "setItem" | "getItem" | "removeItem", body: any) {
      const token = "YOUR_JWT_ACCESS_TOKEN"; // manage your token appropriately
      const res = await fetch("http://localhost:3000/" + action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("dbStorage error: " + res.statusText);
      }
      return await res.json();
    }

    export const dbStorage = {
      async setItem(app: Input, collectionName: Input, collectionKey: Input, key: Input, value: Input) {
        return send("setItem", {
          app: normalize(app),
          collectionName: normalize(collectionName),
          collectionKey: normalize(collectionKey),
          key: normalize(key),
          value: normalize(value),
        });
      },

      async getItem(app: Input, collectionName: Input, collectionKey: Input, key?: Input, value?: Input) {
        return send("getItem", {
          app: normalize(app),
          collectionName: normalize(collectionName),
          collectionKey: normalize(collectionKey),
          key: normalize(key),
          value: normalize(value),
        });
      },

      async removeItem(app: Input, collectionName: Input, collectionKey: Input, key?: Input, value?: Input) {
        return send("removeItem", {
          app: normalize(app),
          collectionName: normalize(collectionName),
          collectionKey: normalize(collectionKey),
          key: normalize(key),
          value: normalize(value),
        });
      },
    };
    ```

2.  **Use it in your application:**

    ```javascript
    import { dbStorage } from './utils/dbStorage';

    // Set a single item
    await dbStorage.setItem("my-app", "users", "user1", "email", "user1@example.com");

    // Set multiple items using the zipping logic
    await dbStorage.setItem(
      "my-app",
      "users",
      ["user1", "user2"], // collectionKey
      ["name", "name"],    // key
      ["Alice", "Bob"]     // value
    );

    // Get all items in a collection
    const result = await dbStorage.getItem("my-app", "users", null, null);
    // console.log(result) will output a nested object structured by app and collectionName

    // Remove all items where the key is "email" within the "users" collection
    await dbStorage.removeItem("my-app", "users", null, "email");
    ```

## API Reference

All `/setItem`, `/getItem`, and `/removeItem` endpoints, as well as all `/user` endpoints, require an `Authorization` header with a bearer token: `Authorization: Bearer <YOUR_ACCESS_TOKEN>`.

### Authentication API (`/auth`)

| Method | Endpoint             | Description                                          | Request Body                                |
| :----- | :------------------- | :--------------------------------------------------- | :------------------------------------------ |
| `POST` | `/signup`            | Registers a new user.                                | `{ id, password, contact, access }`         |
| `POST` | `/signin`            | Authenticates a user and returns tokens.             | `{ id, password }`                          |
| `POST` | `/refreshtoken`      | Issues a new access token using a valid refresh token. | `{ token: "your_refresh_token" }`             |

### Storage API

| Method | Endpoint        | Description                                                                                                                                                                             | Request Body                                                             |
| :----- | :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| `POST` | `/setItem`      | Creates or updates one or more items. If an item with the same unique `(app, collectionName, collectionKey, key)` exists, it's updated. Otherwise, it's created (upsert).                | `{ app, collectionName, collectionKey, key, value }`                     |
| `POST` | `/getItem`      | Retrieves items matching the query. Providing `null` for a field acts as a wildcard. Returns data in a nested JSON object.                                                               | `{ app, collectionName, collectionKey, key?, value? }`                   |
| `POST` | `/removeItem`   | Deletes items matching the query. Uses the same powerful filtering logic as `/getItem`.                                                                                                 | `{ app, collectionName, collectionKey, key?, value? }`                   |
| `POST` | `/clearAll`     | **DANGER ZONE**: Deletes all documents in the storage collection. Requires a password defined in the `.env` file (`CLEAR_ALL_KEY`).                                                        | `{ password }`                                                           |

### User API (`/user`)

| Method   | Endpoint          | Description                                                                 | Request Body            |
| :------- | :---------------- | :-------------------------------------------------------------------------- | :---------------------- |
| `PUT`    | `/update-id`      | Updates the authenticated user's ID.                                        | `{ newId }`             |
| `PUT`    | `/update-password`| Updates the user's password. The user must have an `id` or `contact` set.   | `{ newPassword }`       |
| `PUT`    | `/update-contact` | Updates the user's contact information.                                     | `{ contact: [...] }`    |
| `PUT`    | `/update-access`  | Updates the user's access permissions.                                      | `{ access: [...] }`     |
| `DELETE` | `/delete-account` | Deletes the authenticated user's account.                                   | (No body)               |

## Core Concepts

### Query Logic: Broadcast vs. Zipping

The storage API uses two distinct modes for handling array inputs:

-   **Broadcast Mode**: If exactly one field in the request body is an array with more than one element, the query treats it as a filter with the `$in` operator. For example, `getItem({ app: "my-app", key: ["name", "email"] })` retrieves all items in "my-app" where the key is either "name" or "email".

-   **Zipping Mode**: If two or more fields are arrays, they **must** have the same length. The system "zips" them together, creating a specific query for each index. For example, `setItem({ key: ["key1", "key2"], value: ["val1", "val2"] })` executes two distinct operations: one for `(key1, val1)` and another for `(key2, val2)`. If array lengths are inconsistent, the API will return an error.

### Permissions / Access Control

User access is controlled by the `access` field in the `User` model. It is an array of permission tuples, where each tuple defines access for a specific data segment.

-   **Structure**: `[app, collectionName, collectionKey, [permissions]]`
-   **Example**: `[["my-app", "users", "user123", ["get", "set"]]]` grants the user `get` and `set` permissions on items where `app` is "my-app", `collectionName` is "users", and `collectionKey` is "user123".

Before executing any storage operation, the system validates that the user possesses the required permission (`get`, `set`, or `remove`) for every item targeted by the request.

## Database Schema

### Storage Model

This model stores the key-value data. A unique compound index ensures that each item is uniquely identified by the combination of its primary fields.

| Field          | Type        | Description                                       |
| :------------- | :---------- | :------------------------------------------------ |
| `app`          | String      | The application or namespace.                     |
| `collectionName`| String      | A logical grouping, like a table.                 |
| `collectionKey`| String      | A sub-grouping or primary identifier within a collection. |
| `key`          | String      | The specific key for the value.                   |
| `value`        | Mixed       | The data to be stored.                            |

### User Model

This model stores user credentials and permissions.

| Field       | Type           | Description                                                                              |
| :---------- | :------------- | :--------------------------------------------------------------------------------------- |
| `id`        | String         | The user's unique identifier for login.                                                  |
| `password`  | String         | The user's hashed password.                                                              |
| `contact`   | Array          | An array of contact objects, e.g., `{ name: 'email', value: 'user@test.com' }`.           |
| `access`    | Array of Arrays| An array defining the user's data access permissions. See [Permissions](#permissions--access-control). |
