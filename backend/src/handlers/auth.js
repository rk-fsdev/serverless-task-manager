/**
 * Handles user sign up and sign in - basically the front door to our app
 */
const { success, error, validationError } = require("../utils/response");
const { validate, authSchema, loginSchema } = require("../utils/validation");
const { createUser, authenticateUser } = require("../utils/auth");

/**
 * The main function that routes auth requests to the right place
 */
const handler = async (event) => {
  try {
    const { httpMethod, body } = event;

    if (!body) {
      return error("Request body is required", 400);
    }

    const requestData = JSON.parse(body);
    const { action } = requestData;

    switch (action) {
      case "register":
        return await handleRegister(requestData);
      case "login":
        return await handleLogin(requestData);
      default:
        return error("Invalid action. Supported actions: register, login", 400);
    }
  } catch (err) {
    console.error("Auth handler error:", err);
    return error("Internal server error", 500);
  }
};

/**
 * Creates a new user account - pretty straightforward
 */
const handleRegister = async (requestData) => {
  const { email, password, name } = requestData;

  // Make sure the data looks good before we proceed
  const validation = validate(authSchema, { email, password, name });
  if (!validation.isValid) {
    return validationError(validation.errors);
  }

  try {
    const user = await createUser(email, password, name);

    return success(
      {
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      201
    );
  } catch (err) {
    console.error("Registration error:", err);

    if (err.code === "UsernameExistsException") {
      return error("User with this email already exists", 409);
    }

    if (err.code === "InvalidPasswordException") {
      return error("Password does not meet requirements", 400);
    }

    return error("Failed to register user", 500);
  }
};

/**
 * Signs in an existing user and gives them tokens
 */
const handleLogin = async (requestData) => {
  const { email, password } = requestData;

  // Check if the login data is valid
  const validation = validate(loginSchema, { email, password });
  if (!validation.isValid) {
    return validationError(validation.errors);
  }

  try {
    const authResult = await authenticateUser(email, password);

    // Sometimes Cognito wants extra verification (like a new password)
    if (authResult.challengeName) {
      return success({
        challengeName: authResult.challengeName,
        session: authResult.session,
        message: "Additional authentication required",
      });
    }

    return success({
      message: "Login successful",
      tokens: {
        accessToken: authResult.accessToken,
        idToken: authResult.idToken,
        refreshToken: authResult.refreshToken,
        tokenType: authResult.tokenType,
        expiresIn: authResult.expiresIn,
      },
    });
  } catch (err) {
    console.error("Login error:", err);

    if (err.code === "NotAuthorizedException") {
      return error("Invalid email or password", 401);
    }

    if (err.code === "UserNotFoundException") {
      return error("User not found", 404);
    }

    if (err.code === "UserNotConfirmedException") {
      return error("User account not confirmed", 403);
    }

    return error("Login failed", 500);
  }
};

module.exports = { handler };
