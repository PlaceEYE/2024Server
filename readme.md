# API Documentation

## Base URL
`http://localhost:3000`

## Endpoints

### 1. Register a New Client
- **Endpoint**: `/register`
- **Method**: `POST`
- **Description**: Registers a new client with a unique name. Returns an error if the name already exists.

**Request Body:**
```json
{
  "name": "someName"
}
```

**Response:**

- **201 Created:**
```json
{
  "id": 1,
  "name": "someName",
  "enter": false,
  "qrPresent": false,
  "exhibitionSection": null
}
```

- **400 Bad Request:**
```json
{
  "error": "Name already exists"
}
```

- **500 Internal Server Error:**
```json
{
  "error": "Error message"
}
```

### 2. QR Scan
- **Endpoint**: `/qr-scan`
- **Method**: `POST`
- **Description**: Updates the enter status of a client. If enter is false, sets it to true and returns `entered: false`. If enter is true, returns `entered: true`.

**Request Body:**
```json
{
  "id": 1
}
```

**Response:**

- **200 OK (if enter was previously false):**
```json
{
  "entered": false
}
```

- **200 OK (if enter was previously true):**
```json
{
  "entered": true
}
```

- **404 Not Found:**
```json
{
  "error": "Client not found"
}
```

- **500 Internal Server Error:**
```json
{
  "error": "Error message"
}
```

### 3. Move Client to Section
- **Endpoint**: `/move`
- **Method**: `POST`
- **Description**: Moves a client to a specified exhibition section (A, B, C, or D).

**Request Body:**
```json
{
  "id": 1,
  "section": "A"
}
```

**Response:**

- **200 OK:**
```json
{
  "section": "A"
}
```

- **400 Bad Request:**
```json
{
  "error": "Invalid section"
}
```

- **404 Not Found:**
```json
{
  "error": "Client not found"
}
```

- **500 Internal Server Error:**
```json
{
  "error": "Error message"
}
```

### 4. Login
- **Endpoint**: `/login`
- **Method**: `POST`
- **Description**: Returns the ID of the client with the specified name.

**Request Body:**
```json
{
  "name": "someName"
}
```

**Response:**

- **200 OK:**
```json
{
  "id": 1
}
```

- **404 Not Found:**
```json
{
  "error": "Name not found"
}
```

- **500 Internal Server Error:**
```json
{
  "error": "Error message"
}
```

## Example Usage

**Register a New Client**
```bash
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"name": "John Doe"}'
```

**QR Scan**
```bash
curl -X POST http://localhost:3000/qr-scan -H "Content-Type: application/json" -d '{"id": 1}'
```

**Move Client to Section**
```bash
curl -X POST http://localhost:3000/move -H "Content-Type: application/json" -d '{"id": 1, "section": "B"}'
```

**Login**
```bash
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"name": "John Doe"}'
```
