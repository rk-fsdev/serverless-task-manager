const {
  success,
  error,
  validationError,
  notFound,
  unauthorized,
  forbidden,
} = require("../../src/utils/response");

describe("Response Utils", () => {
  describe("success", () => {
    it("should return success response with default status code", () => {
      const result = success({ message: "Test" });

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({
        success: true,
        data: { message: "Test" },
      });
    });

    it("should return success response with custom status code", () => {
      const result = success({ message: "Created" }, 201);

      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body)).toEqual({
        success: true,
        data: { message: "Created" },
      });
    });
  });

  describe("error", () => {
    it("should return error response with default status code", () => {
      const result = error("Test error");

      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body)).toEqual({
        success: false,
        error: {
          message: "Test error",
        },
      });
    });

    it("should return error response with custom status code and details", () => {
      const result = error("Test error", 400, { field: "email" });

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({
        success: false,
        error: {
          message: "Test error",
          details: { field: "email" },
        },
      });
    });
  });

  describe("validationError", () => {
    it("should return validation error response", () => {
      const errors = [{ field: "email", message: "Invalid email" }];
      const result = validationError(errors);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({
        success: false,
        error: {
          message: "Validation failed",
          details: errors,
        },
      });
    });
  });

  describe("notFound", () => {
    it("should return not found response with default resource", () => {
      const result = notFound();

      expect(result.statusCode).toBe(404);
      expect(JSON.parse(result.body)).toEqual({
        success: false,
        error: {
          message: "Resource not found",
        },
      });
    });

    it("should return not found response with custom resource", () => {
      const result = notFound("Task");

      expect(result.statusCode).toBe(404);
      expect(JSON.parse(result.body)).toEqual({
        success: false,
        error: {
          message: "Task not found",
        },
      });
    });
  });

  describe("unauthorized", () => {
    it("should return unauthorized response with default message", () => {
      const result = unauthorized();

      expect(result.statusCode).toBe(401);
      expect(JSON.parse(result.body)).toEqual({
        success: false,
        error: {
          message: "Unauthorized",
        },
      });
    });

    it("should return unauthorized response with custom message", () => {
      const result = unauthorized("Invalid token");

      expect(result.statusCode).toBe(401);
      expect(JSON.parse(result.body)).toEqual({
        success: false,
        error: {
          message: "Invalid token",
        },
      });
    });
  });

  describe("forbidden", () => {
    it("should return forbidden response with default message", () => {
      const result = forbidden();

      expect(result.statusCode).toBe(403);
      expect(JSON.parse(result.body)).toEqual({
        success: false,
        error: {
          message: "Forbidden",
        },
      });
    });

    it("should return forbidden response with custom message", () => {
      const result = forbidden("Access denied");

      expect(result.statusCode).toBe(403);
      expect(JSON.parse(result.body)).toEqual({
        success: false,
        error: {
          message: "Access denied",
        },
      });
    });
  });
});
