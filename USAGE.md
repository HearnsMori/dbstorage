dbStorage API Usage Guide

This guide demonstrates the flow of authentication, data storage, and permission management using the dbStorage API.

Authentication & User Management

1. Sign Up

Create a new account with initial contact info and access rules.

Endpoint: POST /auth/signup

Payload:

Note: Access is defined as an array of rules.
Format: [AppName, CollectionName, CollectionKey, [Methods]]

{
  "id": "mori",
  "password": "mori123",
  "contact": [
    { "name": "email", "value": "hearnsmori37@gmail.com" }
  ],
  "access": [
    [ "nursync", "user", "mori123", ["set", "get", "remove"] ]
  ]
}


2. Log In

Authenticate to receive session tokens.

Endpoint: POST /auth/signin

{
  "id": "mori",
  "password": "mori123"
}


Response:
Returns an object containing accessToken (short-lived) and refreshToken (long-lived).

3. Get User Profile

Retrieve user details and verify current access rules.

Endpoint: GET /user/read
Headers: Authorization: Bearer <accessToken>

Response:

{
  "user": {
    "_id": "6920247021574567199959b5",
    "id": "mori",
    "contact": [
      {
        "name": "email",
        "value": "hearnsmori37@gmail.com",
        "_id": "6920247021574567199959b6"
      }
    ],
    "access": [
      [ "nursync", "user", "mori123", ["set", "get", "remove"] ]
    ],
    "__v": 0
  }
}


4. Refresh Token

Obtain a new access token when the old one expires.

Endpoint: POST /auth/refreshtoken

Payload:

{
  "token": "<your_refresh_token>"
}


Data Operations

The core storage API checks permissions strictly against the user's access rules.

Scenario A: Exact Match (Success)

User writes to a location explicitly defined in their access rules.

Endpoint: POST /setItem

Request:

{
  "app": "nursync",
  "collectionName": "user",
  "collectionKey": "mori123",
  "key": "university",
  "value": "STI College"
}


Response:

{
  "message": "Items saved/updated successfully",
  "affected": 1
}


Permission Management

1. Granting Wildcard Access

Expand permissions using null as a wildcard.

null in a field matches ALL values for that level.

Endpoint: POST /user/access-add

Payload:
The following rule grants access to ALL collections and keys within the nursync app:

{
  "accessEntry": ["nursync", null, null, ["get", "set", "remove"]]
}


2. Wildcard Match (Success)

With the wildcard rule added, the user can now write to a different collection (other) within the same app (nursync).

Endpoint: POST /setItem

Request:

{
  "app": "nursync",
  "collectionName": "other",
  "collectionKey": "other",
  "key": "university",
  "value": "STI College"
}


Response:

{
  "message": "Items saved/updated successfully",
  "affected": 1
}


3. Permission Denied

Attempting to access a completely different app (otherapp) fails because the user only has permissions for nursync.

Endpoint: POST /setItem

Request:

{
  "app": "otherapp",
  "collectionName": "other",
  "collectionKey": "other",
  "key": "university",
  "value": "STI College"
}


Response:

{
  "message": "You do not have 'set' permission for some items.",
  "denied": [
    {
      "app": "otherapp",
      "collection": "other",
      "key": "other"
    }
  ]
}
