/**
 * Gets all the tasks for a user - the main list view
 */
const { success, error, unauthorized } = require("../../utils/response");
const { listTasks } = require("../../utils/dynamodb");
const { getUserIdFromToken } = require("../../utils/auth");

/**
 * Fetches all tasks for the logged-in user with pagination
 */
const handler = async (event) => {
  try {
    // Figure out who's asking for tasks
    const userId = getUserIdFromToken(event);
    if (!userId) {
      return unauthorized("Valid authentication token required");
    }

    // Get pagination and filter options from the URL
    const queryParams = event.queryStringParameters || {};
    const limit = Math.min(parseInt(queryParams.limit) || 20, 100); // Don't let them request too many at once
    const lastEvaluatedKey = queryParams.lastEvaluatedKey
      ? JSON.parse(decodeURIComponent(queryParams.lastEvaluatedKey))
      : null;

    // Fetch the tasks from the database
    const result = await listTasks(userId, limit, lastEvaluatedKey);

    return success({
      tasks: result.items,
      pagination: {
        count: result.count,
        limit,
        lastEvaluatedKey: result.lastEvaluatedKey,
        hasMore: !!result.lastEvaluatedKey,
      },
    });
  } catch (err) {
    console.error("List tasks error:", err);
    return error("Failed to list tasks", 500);
  }
};

module.exports = { handler };
