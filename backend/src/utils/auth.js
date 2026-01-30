/**
 * Helper functions for dealing with user authentication and Cognito
 */
const AWS = require("aws-sdk");

const cognito = new AWS.CognitoIdentityServiceProvider();
const USER_POOL_ID = process.env.USER_POOL_ID;
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID;

/**
 * Pulls the user ID out of the JWT token from the request
 */
const getUserIdFromToken = (event) => {
  try {
    const authHeader =
      event.headers.Authorization || event.headers.authorization;
    if (!authHeader) {
      return null;
    }

    // Get the actual token from "Bearer <token>" format
    const token = authHeader.split(" ")[1];
    if (!token) {
      return null;
    }

    // Decode the JWT token (we're doing basic decoding here for demo purposes)
    // In a real production app, you'd want to verify the token signature too
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    return payload.sub; // The 'sub' field has the user ID
  } catch (error) {
    console.error("Error extracting user ID from token:", error);
    return null;
  }
};

/**
 * Fetches user info from Cognito (email, name, etc.)
 */
const getUserDetails = async (userId) => {
  try {
    const params = {
      UserPoolId: USER_POOL_ID,
      Username: userId,
    };

    const result = await cognito.adminGetUser(params).promise();

    const user = {
      id: userId,
      email: result.UserAttributes.find((attr) => attr.Name === "email")?.Value,
      name: result.UserAttributes.find((attr) => attr.Name === "name")?.Value,
      status: result.UserStatus,
      createdAt: result.UserCreateDate,
      lastModified: result.UserLastModifiedDate,
    };

    return user;
  } catch (error) {
    console.error("Error getting user details:", error);
    return null;
  }
};

/**
 * Creates a new user account in Cognito
 */
const createUser = async (email, password, name) => {
  try {
    const params = {
      UserPoolId: USER_POOL_ID,
      Username: email,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "name",
          Value: name,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
      MessageAction: "SUPPRESS", // Skip the welcome email for now
      TemporaryPassword: password,
    };

    const result = await cognito.adminCreateUser(params).promise();

    // Make the password permanent (not temporary)
    await cognito
      .adminSetUserPassword({
        UserPoolId: USER_POOL_ID,
        Username: email,
        Password: password,
        Permanent: true,
      })
      .promise();

    return {
      id: result.User.Username,
      email: result.User.Attributes.find((attr) => attr.Name === "email")
        ?.Value,
      name: result.User.Attributes.find((attr) => attr.Name === "name")?.Value,
      status: result.User.UserStatus,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Signs in a user and returns their auth tokens
 */
const authenticateUser = async (email, password) => {
  try {
    const params = {
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      UserPoolId: USER_POOL_ID,
      ClientId: USER_POOL_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    const result = await cognito.adminInitiateAuth(params).promise();

    if (result.ChallengeName) {
      // Sometimes Cognito wants extra steps (like setting a new password)
      return {
        challengeName: result.ChallengeName,
        session: result.Session,
        challengeParameters: result.ChallengeParameters,
      };
    }

    return {
      accessToken: result.AuthenticationResult.AccessToken,
      idToken: result.AuthenticationResult.IdToken,
      refreshToken: result.AuthenticationResult.RefreshToken,
      tokenType: result.AuthenticationResult.TokenType,
      expiresIn: result.AuthenticationResult.ExpiresIn,
    };
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
};

/**
 * Gets a fresh access token using the refresh token
 */
const refreshToken = async (refreshToken) => {
  try {
    const params = {
      AuthFlow: "REFRESH_TOKEN_AUTH",
      UserPoolId: USER_POOL_ID,
      ClientId: USER_POOL_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };

    const result = await cognito.adminInitiateAuth(params).promise();

    return {
      accessToken: result.AuthenticationResult.AccessToken,
      idToken: result.AuthenticationResult.IdToken,
      tokenType: result.AuthenticationResult.TokenType,
      expiresIn: result.AuthenticationResult.ExpiresIn,
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

/**
 * Signs out a user (invalidates their tokens)
 */
const signOut = async (accessToken) => {
  try {
    const params = {
      AccessToken: accessToken,
    };

    await cognito.globalSignOut(params).promise();
    return true;
  } catch (error) {
    console.error("Error signing out user:", error);
    throw error;
  }
};

module.exports = {
  getUserIdFromToken,
  getUserDetails,
  createUser,
  authenticateUser,
  refreshToken,
  signOut,
};
