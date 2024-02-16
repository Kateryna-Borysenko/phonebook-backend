# node-rest-api

## Description

This repository contains the second homework assignment for building a REST API
for managing a contacts collection. The API supports CRUD operations on a simple
contacts database stored in JSON format.

## API Endpoints

- List all contacts `GET /api/contacts`

<img src="./screens/get-all.png" width="100%">

- Get a contact by ID `GET /api/contacts/:id`

<img src="./screens/get-by-id.png" width="100%">

- Delete a contact `DELETE /api/contacts/:id`

<img src="./screens/delete-contact.png" width="100%">

- Add a new contact `POST /api/contacts`

<img src="./screens/create-contact.png" width="100%">

- Update a contact `PUT /api/contacts/:id`

<img src="./screens/update-contact.png" width="100%">

## Usage

Use Postman to test the API endpoints by sending requests to
http://localhost:5000/api/contacts.

## Validation

Validation of request bodies is performed using Joi. Ensure that your request
data matches the schema requirements for each endpoint.

## Error Handling

The API uses custom error handling middleware to manage responses for invalid
requests or when resources are not found.

## License

[MIT](https://choosealicense.com/licenses/mit/)
