/**
 * Input validation schemas - makes sure data is clean before it hits the database
 */
const Joi = require("joi");

const taskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).allow(""),
  priority: Joi.string().valid("low", "medium", "high").default("medium"),
  status: Joi.string()
    .valid("pending", "in-progress", "completed")
    .default("pending"),
  dueDate: Joi.date().iso().allow(null),
  category: Joi.string().max(50).allow(""),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  description: Joi.string().max(1000).allow(""),
  priority: Joi.string().valid("low", "medium", "high"),
  status: Joi.string().valid("pending", "in-progress", "completed"),
  dueDate: Joi.date().iso().allow(null),
  category: Joi.string().max(50).allow(""),
}).min(1); // Gotta update at least one field

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).max(100).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    return { isValid: false, errors, value: null };
  }

  return { isValid: true, errors: null, value };
};

module.exports = {
  taskSchema,
  updateTaskSchema,
  authSchema,
  loginSchema,
  validate,
};
