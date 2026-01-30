const { handler } = require("../../../src/handlers/tasks/create");

describe("Create Task Handler", () => {
  let mockEvent;

  beforeEach(() => {
    mockEvent = {
      httpMethod: "POST",
      headers: {
        Authorization: "Bearer valid-token",
      },
      body: JSON.stringify({
        title: "Test Task",
        description: "Test Description",
        priority: "medium",
        status: "pending",
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /tasks", () => {
    it("should create a task successfully", async () => {
      const result = await handler(mockEvent);

      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body).success).toBe(true);
      expect(JSON.parse(result.body).data.task).toBeDefined();
    });

    it("should return 401 for missing authorization", async () => {
      mockEvent.headers = {};

      const result = await handler(mockEvent);

      expect(result.statusCode).toBe(401);
      expect(JSON.parse(result.body).success).toBe(false);
    });

    it("should return 400 for missing body", async () => {
      mockEvent.body = null;

      const result = await handler(mockEvent);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).success).toBe(false);
    });

    it("should return 400 for invalid task data", async () => {
      mockEvent.body = JSON.stringify({
        title: "", // Invalid: empty title
        priority: "invalid", // Invalid: not in enum
      });

      const result = await handler(mockEvent);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).success).toBe(false);
    });
  });
});
