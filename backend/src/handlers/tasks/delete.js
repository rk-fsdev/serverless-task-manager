/**
 * Delete task handler
 */
const {
  success,
  error,
  notFound,
  unauthorized,
} = require("../../utils/response");
const { deleteTask } = require("../../utils/dynamodb");
const { getUserIdFromToken } = require("../../utils/auth");

/**
 * Delete a specific task
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

    // Delete task
    const deletedTask = await deleteTask(id, userId);
    if (!deletedTask) {
      return notFound("Task");
    }

    return success({
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (err) {
    console.error("Delete task error:", err);
    return error("Failed to delete task", 500);
  }
};

module.exports = { handler };
