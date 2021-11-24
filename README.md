# simple-crud-api

# Description
- Your task is to implement simple CRUD API using in-memory database underneath.
NB! You must create new repository for this task. Its name must be simple-crud-api i.e. full link to the repository must be https://github.com/%your-gihub-id%/simple-crud-api.

Details:
- The task must be solved using only pure Node.js. Any libraries and packages (except nodemon, eslint and its plugins, prettier and its plugins, uuid, webpack and its plugins, testing tools, dotenv, cross-env) are prohibited.
API path /person:
- GET /person or /person/${personId} should return all persons or person with corresponding personId
- POST /person is used to create record about new person and store it in database
- PUT /person/${personId} is used to update record about existing person
- DELETE /person/${personId} is used to delete record about existing person from database
Persons are stored as objects that have following properties:
- id — unique identifier (string, uuid) generated on server side
- name — person's name (string, required)
- age — person's age (number, required)
- hobbies — person's hobbies (array of strings or empty array, required)
Requests to non-existing endpoints (e.g. /some-non/existing/resource) should be handled.
Internal server errors should be handled and processed correctly.
Value of port on which application is running should be stored in .env file.
There should be 2 modes of running application: development and production