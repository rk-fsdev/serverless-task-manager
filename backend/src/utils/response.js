/**
 * Helper functions for creating consistent API responses
 */

const createResponse = (statusCode, body, headers = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  };

  return {
    statusCode,
    headers: { ...defaultHeaders, ...headers },
    body: JSON.stringify(body),
  };
};

const success = (data, statusCode = 200) => {
  return createResponse(statusCode, {
    success: true,
    data,
  });
};

const error = (message, statusCode = 500, details = null) => {
  const body = {
    success: false,
    error: {
      message,
      ...(details && { details }),
    },
  };

  return createResponse(statusCode, body);
};

const validationError = (errors) => {
  return createResponse(400, {
    success: false,
    error: {
      message: "Validation failed",
      details: errors,
    },
  });
};

const notFound = (resource = "Resource") => {
  return createResponse(404, {
    success: false,
    error: {
      message: `${resource} not found`,
    },
  });
};

const unauthorized = (message = "Unauthorized") => {
  return createResponse(401, {
    success: false,
    error: {
      message,
    },
  });
};

const forbidden = (message = "Forbidden") => {
  return createResponse(403, {
    success: false,
    error: {
      message,
    },
  });
};

module.exports = {
  createResponse,
  success,
  error,
  validationError,
  notFound,
  unauthorized,
  forbidden,
};
