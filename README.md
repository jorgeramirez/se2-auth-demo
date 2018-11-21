# se2-auth-demo

[![Build Status](https://travis-ci.com/jorgeramirez/se2-auth-demo.svg?branch=master)](https://travis-ci.com/jorgeramirez/se2-auth-demo)

A small example that shows how to add authentication to your API using Google.

## Run

Clone the repo and install the dependencies by doing

```
$   npm i
```

Copy the `.env.example` file and name the copy `.env`. Configure in the `.env` file the information
to contact the Google API (read the beginning of [this post](https://medium.com/@bogna.ka/integrating-google-oauth-with-express-application-f8a4a2cf3fee)).

Run the application by doing:

```
$   npm start
```

Endpoints

- http://localhost:3000/ health check endpoint (public)
- http://localhost:3000/auth/google endpoint to authenticate with google
- http://localhost:3000/auth/google/callback the google auth workflow redirects here, this endpoint returns the token to access the protected endpoints
- http://localhost:3000/api/v1/me protected endpoint returns information about the logged user.

To call the protected endpoint you need to pass in the token

```
$ curl -v -H "Authorization: Bearer <generated token>" http://localhost:3000/api/v1/me
$ curl -v http://localhost:3000/api/v1/me?access_token=<generated token>
```
