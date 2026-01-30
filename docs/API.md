# API Documentation

## Overview

The Task Manager API provides RESTful endpoints for managing tasks with user authentication via AWS Cognito.

## Base URL

- **Development**: `https://your-api-gateway-url.amazonaws.com/dev`
- **Production**: `https://your-api-gateway-url.amazonaws.com/prod`

## Authentication

All endpoints (except authentication) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## Endpoints

### Authentication

#### Register User

```http
POST /auth
Content-Type: application/json

{
  "action": "register",
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "User registered successfully",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

#### Login User

```http
POST /auth
Content-Type: application/json

{
  "action": "login",
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Login successful",
    "tokens": {
      "accessToken": "jwt-access-token",
      "idToken": "jwt-id-token",
      "refreshToken": "refresh-token",
      "tokenType": "Bearer",
      "expiresIn": 3600
    }
  }
}
```

### Tasks

#### List Tasks

```http
GET /tasks?limit=20&lastEvaluatedKey=encoded-key
Authorization: Bearer <jwt-token>
```

**Query Parameters:**

- `limit` (optional): Number of tasks to return (default: 20, max: 100)
- `lastEvaluatedKey` (optional): Pagination token

**Response:**

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task-id",
        "title": "Task Title",
        "description": "Task description",
        "priority": "medium",
        "status": "pending",
        "category": "Work",
        "dueDate": "2024-12-31T00:00:00.000Z",
        "userId": "user-id",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "count": 1,
      "limit": 20,
      "lastEvaluatedKey": "encoded-key",
      "hasMore": false
    }
  }
}
```

#### Get Task

```http
GET /tasks/{id}
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task-id",
      "title": "Task Title",
      "description": "Task description",
      "priority": "medium",
      "status": "pending",
      "category": "Work",
      "dueDate": "2024-12-31T00:00:00.000Z",
      "userId": "user-id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Create Task

```http
POST /tasks
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "priority": "high",
  "status": "pending",
  "category": "Personal",
  "dueDate": "2024-12-31"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Task created successfully",
    "task": {
      "id": "new-task-id",
      "title": "New Task",
      "description": "Task description",
      "priority": "high",
      "status": "pending",
      "category": "Personal",
      "dueDate": "2024-12-31T00:00:00.000Z",
      "userId": "user-id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Update Task

```http
PUT /tasks/{id}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Task",
  "status": "completed"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Task updated successfully",
    "task": {
      "id": "task-id",
      "title": "Updated Task",
      "description": "Task description",
      "priority": "high",
      "status": "completed",
      "category": "Personal",
      "dueDate": "2024-12-31T00:00:00.000Z",
      "userId": "user-id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

#### Delete Task

```http
DELETE /tasks/{id}
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Task deleted successfully",
    "task": {
      "id": "task-id",
      "title": "Deleted Task",
      "description": "Task description",
      "priority": "high",
      "status": "completed",
      "category": "Personal",
      "dueDate": "2024-12-31T00:00:00.000Z",
      "userId": "user-id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

## Data Models

### Task

```json
{
  "id": "string (UUID)",
  "title": "string (required, max 200 chars)",
  "description": "string (optional, max 1000 chars)",
  "priority": "enum (low, medium, high)",
  "status": "enum (pending, in-progress, completed)",
  "category": "string (optional, max 50 chars)",
  "dueDate": "ISO 8601 date string (optional)",
  "userId": "string (Cognito user ID)",
  "createdAt": "ISO 8601 date string",
  "updatedAt": "ISO 8601 date string"
}
```

### User

```json
{
  "id": "string (Cognito user ID)",
  "email": "string (email address)",
  "name": "string (full name)",
  "status": "string (user status)"
}
```

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "error": {
    "message": "Valid authentication token required"
  }
}
```

### Not Found (404)

```json
{
  "success": false,
  "error": {
    "message": "Task not found"
  }
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "error": {
    "message": "Internal server error"
  }
}
```

## Rate Limiting

- API Gateway has default rate limits
- Consider implementing custom rate limiting for production use

## CORS

CORS is configured to allow requests from:

- `http://localhost:3000` (development)
- Your production domain

## Examples

### cURL Examples

#### Register User

```bash
curl -X POST https://your-api-gateway-url.amazonaws.com/dev/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "register",
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe"
  }'
```

#### Create Task

```bash
curl -X POST https://your-api-gateway-url.amazonaws.com/dev/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "priority": "high",
    "status": "pending"
  }'
```

#### List Tasks

```bash
curl -X GET https://your-api-gateway-url.amazonaws.com/dev/tasks \
  -H "Authorization: Bearer your-jwt-token"
```

### JavaScript Examples

#### Using Fetch API

```javascript
// Create task
const createTask = async (taskData) => {
  const response = await fetch(
    "https://your-api-gateway-url.amazonaws.com/dev/tasks",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    }
  );

  return response.json();
};

// List tasks
const listTasks = async () => {
  const response = await fetch(
    "https://your-api-gateway-url.amazonaws.com/dev/tasks",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};
```

#### Using Axios

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "https://your-api-gateway-url.amazonaws.com/dev",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Create task
const createTask = (taskData) => api.post("/tasks", taskData);

// List tasks
const listTasks = () => api.get("/tasks");

// Update task
const updateTask = (id, updateData) => api.put(`/tasks/${id}`, updateData);

// Delete task
const deleteTask = (id) => api.delete(`/tasks/${id}`);
```

## SDKs

### AWS SDK

```javascript
import { APIGatewayClient, InvokeCommand } from "@aws-sdk/client-api-gateway";

const client = new APIGatewayClient({ region: "us-east-1" });
```

### Serverless Framework

```yaml
# serverless.yml
functions:
  createTask:
    handler: src/handlers/tasks/create.handler
    events:
      - http:
          path: /tasks
          method: post
          cors: true
          authorizer:
            name: cognitoAuthorizer
            type: COGNITO_USER_POOLS
            arn: !GetAtt CognitoUserPool.Arn
```

## Monitoring and Logging

### CloudWatch Logs

- Lambda function logs are automatically sent to CloudWatch
- Log groups: `/aws/lambda/task-manager-backend-{stage}-{function-name}`

### CloudWatch Metrics

- Request count and latency
- Error rates
- Throttle count

### X-Ray Tracing

- Enable X-Ray tracing for detailed request tracing
- Add `tracing: true` to serverless.yml

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Users can only access their own tasks
3. **Input Validation**: All inputs are validated using Joi schemas
4. **CORS**: Configured for specific domains
5. **HTTPS**: All communications are encrypted
6. **Rate Limiting**: Consider implementing custom rate limiting

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check if JWT token is valid and not expired
2. **403 Forbidden**: User doesn't have permission to access the resource
3. **404 Not Found**: Resource doesn't exist or user doesn't own it
4. **400 Bad Request**: Invalid input data or validation errors
5. **500 Internal Server Error**: Check CloudWatch logs for details

### Debugging

1. Check CloudWatch logs for Lambda functions
2. Verify API Gateway configuration
3. Test endpoints with tools like Postman or cURL
4. Check DynamoDB table permissions
5. Verify Cognito user pool configuration
