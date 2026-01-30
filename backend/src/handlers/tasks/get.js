/**
 * Get task handler
 */
const {
  success,
  error,
  notFound,
  unauthorized,
} = require("../../utils/response");
const { getTask } = require("../../utils/dynamodb");
const { getUserIdFromToken } = require("../../utils/auth");

/**
 * Get a specific task by ID
 */
const handler = async (event) => {
  try {
    // Extract user ID from token
    const userId = getUserIdFromToken(event);
    if (!userId) {
      return unauthorized("Valid authentication token required");
    }

    // Extract task ID from path parameters
    const { id } = event.pathParameters || {};
    if (!id) {
      return error("Task ID is required", 400);
    }

    // Get task
    const task = await getTask(id, userId);
    if (!task) {
      return notFound("Task");
    }

    return success({
      task,
    });
  } catch (err) {
    console.error("Get task error:", err);
    return error("Failed to get task", 500);
  }
};

module.exports = { handler };
