/**
 * Helper functions for talking to DynamoDB - the database layer
 */
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamodb = new AWS.DynamoDB.DocumentClient();

const TASKS_TABLE = process.env.TASKS_TABLE;

/**
 * Saves a new task to the database
 */
const createTask = async (taskData, userId) => {
  const task = {
    id: uuidv4(),
    userId,
    ...taskData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const params = {
    TableName: TASKS_TABLE,
    Item: task,
  };

  await dynamodb.put(params).promise();
  return task;
};

/**
 * Fetches a specific task by its ID
 */
const getTask = async (id, userId) => {
  const params = {
    TableName: TASKS_TABLE,
    Key: { id },
  };

  const result = await dynamodb.get(params).promise();

  // Make sure the task exists and belongs to the user
  if (!result.Item || result.Item.userId !== userId) {
    return null;
  }

  return result.Item;
};

/**
 * Gets all tasks for a user with pagination support
 */
const listTasks = async (userId, limit = 20, lastEvaluatedKey = null) => {
  const params = {
    TableName: TASKS_TABLE,
    IndexName: "UserIdIndex",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
    ScanIndexForward: false, // Show newest tasks first
    Limit: limit,
  };

  if (lastEvaluatedKey) {
    params.ExclusiveStartKey = lastEvaluatedKey;
  }

  const result = await dynamodb.query(params).promise();

  return {
    items: result.Items || [],
    lastEvaluatedKey: result.LastEvaluatedKey,
    count: result.Count,
  };
};

/**
 * Updates an existing task with new data
 */
const updateTask = async (id, userId, updateData) => {
  const updateExpression = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  // Build the update expression based on what fields are being updated
  Object.keys(updateData).forEach((key, index) => {
    const attributeName = `#attr${index}`;
    const attributeValue = `:val${index}`;

    updateExpression.push(`${attributeName} = ${attributeValue}`);
    expressionAttributeNames[attributeName] = key;
    expressionAttributeValues[attributeValue] = updateData[key];
  });

  // Always update the timestamp when something changes
  updateExpression.push("#updatedAt = :updatedAt");
  expressionAttributeNames["#updatedAt"] = "updatedAt";
  expressionAttributeValues[":updatedAt"] = new Date().toISOString();

  const params = {
    TableName: TASKS_TABLE,
    Key: { id },
    UpdateExpression: `SET ${updateExpression.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ConditionExpression: "userId = :userId",
    ReturnValues: "ALL_NEW",
  };

  // Add the user ID to make sure they can only update their own tasks
  expressionAttributeValues[":userId"] = userId;

  try {
    const result = await dynamodb.update(params).promise();
    return result.Attributes;
  } catch (error) {
    if (error.code === "ConditionalCheckFailedException") {
      return null; // Task not found or doesn't belong to user
    }
    throw error;
  }
};

/**
 * Removes a task from the database
 */
const deleteTask = async (id, userId) => {
  const params = {
    TableName: TASKS_TABLE,
    Key: { id },
    ConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
    ReturnValues: "ALL_OLD",
  };

  try {
    const result = await dynamodb.delete(params).promise();
    return result.Attributes;
  } catch (error) {
    if (error.code === "ConditionalCheckFailedException") {
      return null; // Task not found or doesn't belong to user
    }
    throw error;
  }
};

/**
 * Calculates some basic stats about a user's tasks
 */
const getTaskStats = async (userId) => {
  const params = {
    TableName: TASKS_TABLE,
    IndexName: "UserIdIndex",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
    ProjectionExpression: "status, priority",
  };

  const result = await dynamodb.query(params).promise();
  const tasks = result.Items || [];

  const stats = {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    high: tasks.filter((task) => task.priority === "high").length,
    medium: tasks.filter((task) => task.priority === "medium").length,
    low: tasks.filter((task) => task.priority === "low").length,
  };

  return stats;
};

module.exports = {
  createTask,
  getTask,
  listTasks,
  updateTask,
  deleteTask,
  getTaskStats,
};
