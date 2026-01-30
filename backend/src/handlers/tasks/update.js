/**
 * Update task handler
 */
const {
  success,
  error,
  validationError,
  notFound,
  unauthorized,
} = require("../../utils/response");
const { validate, updateTaskSchema } = require("../../utils/validation");
const { updateTask } = require("../../utils/dynamodb");
const { getUserIdFromToken } = require("../../utils/auth");

/**
 * Update a specific task
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

    // Parse request body
    if (!event.body) {
      return error("Request body is required", 400);
    }

    const updateData = JSON.parse(event.body);

    // Validate input
    const validation = validate(updateTaskSchema, updateData);
    if (!validation.isValid) {
      return validationError(validation.errors);
    }

    // Update task
    const updatedTask = await updateTask(id, userId, validation.value);
    if (!updatedTask) {
      return notFound("Task");
    }

    return success({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    console.error("Update task error:", err);
    return error("Failed to update task", 500);
  }
};

module.exports = { handler };
