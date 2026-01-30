const { handler } = require("../../src/handlers/auth");

describe("Auth Handler", () => {
  let mockEvent;

  beforeEach(() => {
    mockEvent = {
      httpMethod: "POST",
      body: JSON.stringify({
        action: "register",
        email: "test@example.com",
        password: "TestPassword123!",
        name: "Test User",
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth", () => {
    it("should handle register action", async () => {
      const result = await handler(mockEvent);

      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body).success).toBe(true);
    });

    it("should handle login action", async () => {
      mockEvent.body = JSON.stringify({
        action: "login",
        email: "test@example.com",
        password: "TestPassword123!",
      });

      const result = await handler(mockEvent);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body).success).toBe(true);
    });

    it("should return 400 for invalid action", async () => {
      mockEvent.body = JSON.stringify({
        action: "invalid",
      });

      const result = await handler(mockEvent);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).success).toBe(false);
    });

    it("should return 400 for missing body", async () => {
      mockEvent.body = null;

      const result = await handler(mockEvent);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).success).toBe(false);
    });
  });
});
