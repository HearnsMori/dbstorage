# dbStorage System Documentation

## Overview

This repository are used for fast frontend testing with built in backend. Most of the logic will be set in the frontend this will save time in prototyping and testing the vision.

It provides a fully abstracted storage system with advanced multi-value handling, wildcard queries, and strict zipping rules. It supports setItem, getItem, removeItem operations and works flexibly with either single input values or arrays, enabling batch and complex operations.

## Similar

Similar to JS localStorage
```js
localStorage.setItem("key", "value");
```


first add a utils/dbStorage
```js
type Input = string | string[] | null | undefined;

function normalize(value: Input) {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return value;
  return value; // string
}

async function send(action: "set" | "get" | "remove", body: any) {
  const res = await fetch("https://your-backend-url.com/api/dbStorage/" + action, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("dbStorage error: " + res.statusText);
  }

  return await res.json();
}

export const dbStorage = {
  async setItem(app: Input, collection: Input, key: Input, value: Input) {
    return send("set", {
      app: normalize(app),
      collection: normalize(collection),
      key: normalize(key),
      value: normalize(value),
    });
  },

  async getItem(app: Input, collection: Input, key: Input, value?: Input) {
    return send("get", {
      app: normalize(app),
      collection: normalize(collection),
      key: normalize(key),
      value: normalize(value),
    });
  },

  async removeItem(app: Input, collection: Input, key: Input, value?: Input) {
    return send("remove", {
      app: normalize(app),
      collection: normalize(collection),
      key: normalize(key),
      value: normalize(value),
    });
  },
};
```


Now you can import and use those function like this:
```js
//To set
const res = await dbStorage.setItem("app", "collection", ["key1", "key2"], ["valKey1", "valKey2"]);
const res = await dbStorage.setItem("app", ["collection1", "collection2"], ["key1toCol1", "key2toCol2"], "sameVal");

//To get
const res = await dbstorage.getItem("app", null, null, null);
//access it
const dataIWant = res.app.collection.key;

//To remove
const res = await dbstorage.getItem("app", "collection6", null, null); //remove all collection6 in app
const res = await dbstorage.getItem("app", "collection6", null, ["a", "b"]); //remove all collection6 in app that has value a or b

```


## Features
- Input normalization
- Broadcasting logic
- Zipping logic
- Bulk database operations
- Nested structured outputs
- Error handling

## Controllers
### setItem
Handles creation or update operations with support for zipped or broadcasted combinations.

### getItem
Retrieves data using zip-mode or wildcard-mode and returns structured nested JSON.

### removeItem
Deletes documents with the same logic used in getItem queries.

## Query Behavior
- Broadcast Mode: arrays are used as $in filters.
- Zipping Mode: enforces equal-length arrays and processes combinations strictly by index.

## Summary
dbStorage provides deterministic, flexible, and powerful storage with predictable behavior for both batch and single operations.

