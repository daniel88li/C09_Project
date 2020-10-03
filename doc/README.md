# Drawing.io REST API Documentation

## User API

### Create

- description: User sign up
- request: `POST /signup/`
    - content-type: `application/json`
    - body: object
        - username: (string) user's username
        - password: (string) user's password
- response: 200
    - content-type: `application/json`
    - body: user username signed up
- response: 409
    - body: username already exist
- response: 500
    - body: mongo error

``` 
$ curl -H "Content-Type: application/json" -X POST -d '{"username":"Dan","password":"123"}' -c cookie.txt localhost:3000/signup/
```

- description: User sign in
- request: `POST /signin/`
    - content-type: `application/json`
    - body: object
        - username: (string) user's username
        - password: (string) user's password
- response: 200
    - content-type: `application/json`
    - body: user username signed in
- response: 401
    - body: access denied
- response: 500
    - body: mongo error

``` 
$ curl -H "Content-Type: application/json" -X POST -d '{"username":"Dan","password":"123"}' -c cookie.txt localhost:3000/signin/
```

### Read
- description: User sign out
- request: `GET /signout/`
- response: 200

``` 
$ curl -b cookie.txt -c cookie.txt localhost:3000/signout/
```

## Database API

### Read

- description: retrieve the word bank from mongodb
- request: `GET /wordBank/`
- response: 200
    - content-type: `application/json`
    - body: list of word objects
        - _id: (string) the word
- response: 500
    - body: mongo error

``` 
$ curl localhost:3000/wordBank/
``` 
