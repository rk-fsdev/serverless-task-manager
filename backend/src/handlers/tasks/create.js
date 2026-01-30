/**
 * Handles creating new tasks - where the magic happens
 */
const {
  success,
  error,
  validationError,
  unauthorized,
} = require("../../utils/response");
const { validate, taskSchema } = require("../../utils/validation");
const { createTask } = require("../../utils/dynamodb");
const { getUserIdFromToken } = require("../../utils/auth");

/**
 * Creates a shiny new task for the user
 */
const handler = async (event) => {
  try {
    // Figure out who's making this request
    const userId = getUserIdFromToken(event);
    if (!userId) {
      return unauthorized("Valid authentication token required");
    }

    // Get the task data from the request
    if (!event.body) {
      return error("Request body is required", 400);
    }

    const taskData = JSON.parse(event.body);

    // Make sure the task data is valid
    const validation = validate(taskSchema, taskData);
    if (!validation.isValid) {
      return validationError(validation.errors);
    }

    // Save the task to the database
    const task = await createTask(validation.value, userId);

    return success(
      {
        message: "Task created successfully",
        task,
      },
      201
    );
  } catch (err) {
    console.error("Create task error:", err);
    return error("Failed to create task", 500);
  }
};

module.exports = { handler };
