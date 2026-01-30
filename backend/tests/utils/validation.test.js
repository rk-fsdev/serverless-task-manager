const {
  validate,
  taskSchema,
  updateTaskSchema,
  authSchema,
  loginSchema,
} = require("../../src/utils/validation");

describe("Validation Utils", () => {
  describe("taskSchema", () => {
    it("should validate valid task data", () => {
      const validTask = {
        title: "Test Task",
        description: "Test Description",
        priority: "medium",
        status: "pending",
        dueDate: "2024-12-31",
        category: "Work",
      };

      const result = validate(taskSchema, validTask);

      expect(result.isValid).toBe(true);
      expect(result.errors).toBeNull();
      expect(result.value).toEqual(validTask);
    });

    it("should validate task with minimal data", () => {
      const minimalTask = {
        title: "Test Task",
      };

      const result = validate(taskSchema, minimalTask);

      expect(result.isValid).toBe(true);
      expect(result.errors).toBeNull();
      expect(result.value.title).toBe("Test Task");
      expect(result.value.priority).toBe("medium");
      expect(result.value.status).toBe("pending");
    });

    it("should reject task with invalid title", () => {
      const invalidTask = {
        title: "", // Empty title
      };

      const result = validate(taskSchema, invalidTask);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("title");
    });

    it("should reject task with invalid priority", () => {
      const invalidTask = {
        title: "Test Task",
        priority: "invalid",
      };

      const result = validate(taskSchema, invalidTask);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("priority");
    });

    it("should reject task with invalid status", () => {
      const invalidTask = {
        title: "Test Task",
        status: "invalid",
      };

      const result = validate(taskSchema, invalidTask);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("status");
    });
  });

  describe("updateTaskSchema", () => {
    it("should validate valid update data", () => {
      const validUpdate = {
        title: "Updated Task",
        status: "completed",
      };

      const result = validate(updateTaskSchema, validUpdate);

      expect(result.isValid).toBe(true);
      expect(result.errors).toBeNull();
      expect(result.value).toEqual(validUpdate);
    });

    it("should reject empty update data", () => {
      const emptyUpdate = {};

      const result = validate(updateTaskSchema, emptyUpdate);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('"value"');
    });
  });

  describe("authSchema", () => {
    it("should validate valid auth data", () => {
      const validAuth = {
        email: "test@example.com",
        password: "TestPassword123!",
        name: "Test User",
      };

      const result = validate(authSchema, validAuth);

      expect(result.isValid).toBe(true);
      expect(result.errors).toBeNull();
      expect(result.value).toEqual(validAuth);
    });

    it("should reject invalid email", () => {
      const invalidAuth = {
        email: "invalid-email",
        password: "TestPassword123!",
        name: "Test User",
      };

      const result = validate(authSchema, invalidAuth);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("email");
    });

    it("should reject short password", () => {
      const invalidAuth = {
        email: "test@example.com",
        password: "short",
        name: "Test User",
      };

      const result = validate(authSchema, invalidAuth);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("password");
    });
  });

  describe("loginSchema", () => {
    it("should validate valid login data", () => {
      const validLogin = {
        email: "test@example.com",
        password: "TestPassword123!",
      };

      const result = validate(loginSchema, validLogin);

      expect(result.isValid).toBe(true);
      expect(result.errors).toBeNull();
      expect(result.value).toEqual(validLogin);
    });

    it("should reject missing email", () => {
      const invalidLogin = {
        password: "TestPassword123!",
      };

      const result = validate(loginSchema, invalidLogin);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("email");
    });
  });
});
