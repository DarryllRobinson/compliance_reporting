import { BehaviorSubject } from "rxjs";

import config from "../../lib/utils/config";
import { fetchWrapper } from "../../lib/utils/fetch-wrapper";

const userSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}/users`;

export const userService = {
  login,
  logout,
  refreshToken,
  register,
  verifyEmail,
  forgotPassword,
  validateResetToken,
  resetPassword,
  setNewPassword,
  deactivateUser,
  reactivateUser,
  resendInvitation,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  _userSubject: userSubject, // Expose userSubject for testing
};

// Authenticate the user and start a refresh token timer
function login(params) {
  return fetchWrapper.post(`${baseUrl}/authenticate`, params).then((user) => {
    if (!user || typeof user !== "object") {
      throw new Error("Email or password is incorrect");
    }
    if (!user.jwtToken) {
      throw new Error("JWT not included in response");
    }
    userSubject.next(user);
    startRefreshTokenTimer();
    return user;
  });
}

function logout() {
  localStorage.setItem("lastVisitedPath", window.location.pathname);
  // Revoke the refresh token using the cookie
  fetchWrapper
    .post(`${baseUrl}/revoke-token`, {
      refreshToken: getCookie("refreshToken"),
    })
    .catch((error) => {
      console.error(
        "Failed to revoke token during logout:",
        error.message || error
      );
    });
  stopRefreshTokenTimer();
  userSubject.next(null);
}

// Helper to read a cookie by name
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
}

// Refresh the user's JWT token
function refreshToken() {
  return fetchWrapper
    .post(`${baseUrl}/refresh-token`, {})
    .then((user) => {
      if (!user.jwtToken) {
        throw new Error("JWT not included in response");
      }
      userSubject.next(user);
      startRefreshTokenTimer();
      return user;
    })
    .catch((error) => {
      console.error("Failed to refresh token:", error.message || error);
      stopRefreshTokenTimer();
      userSubject.next(null); // Clear user data on failure
      throw error; // Re-throw the error for further handling
    });
}

// Register a new user
function register(params) {
  return fetchWrapper.post(`${baseUrl}/register`, params);
}

// Verify the user's email address
function verifyEmail(token) {
  return fetchWrapper.post(`${baseUrl}/verify-email`, { token });
}

// Send a password reset email
function forgotPassword(email) {
  return fetchWrapper.post(`${baseUrl}/forgot-password`, { email });
}

// Validate the password reset token
function validateResetToken(token) {
  return fetchWrapper.post(`${baseUrl}/validate-reset-token`, { token });
}

// Reset the user's password
function resetPassword({ token, password, confirmPassword }) {
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
  return fetchWrapper.post(`${baseUrl}/reset-password`, {
    token,
    password,
    confirmPassword,
  });
}

function setNewPassword({ token, password, confirmPassword }) {
  return fetchWrapper.post(`/users/set-password`, {
    token,
    password,
    confirmPassword,
  });
}

function deactivateUser(id) {
  return fetchWrapper.put(`/users/deactivate/${id}`);
}

function reactivateUser(id) {
  return fetchWrapper.put(`/users/reactivate/${id}`);
}

function resendInvitation(id) {
  return fetchWrapper.post(`/users/resend-invitation/${id}`);
}

// Fetch all users
function getAll() {
  return fetchWrapper.get(baseUrl);
}

// Fetch a user by ID
function getById(id) {
  return fetchWrapper.get(`${baseUrl}/${id}`);
}

// Create a new user
function create(params) {
  return fetchWrapper.post(baseUrl, params);
}

// Update an existing user
function update(id, params) {
  return fetchWrapper
    .put(`${baseUrl}/${id}`, params)
    .then((user) => {
      if (user.id === userSubject.value.id) {
        user = { ...userSubject.value, ...user };
        userSubject.next(user);
      }
      return user;
    })
    .catch((error) => {
      console.error(`Failed to update user with ID ${id}:`, error.message);
      throw error;
    });
}

// Delete a user
function _delete(id) {
  return fetchWrapper
    .delete(`${baseUrl}/${id}`)
    .then((x) => {
      if (id === userSubject.value.id) {
        logout();
      }
      return x;
    })
    .catch((error) => {
      console.error(`Failed to delete user with ID ${id}:`, error.message);
      throw error;
    });
}

// Helper functions
let refreshTokenTimeout;

// Start the refresh token timer
function startRefreshTokenTimer() {
  const jwtToken = JSON.parse(atob(userSubject.value.jwtToken.split(".")[1]));
  const expires = new Date(jwtToken.exp * 1000);
  const timeout = expires.getTime() - Date.now() - 60 * 1000;
  refreshTokenTimeout = setTimeout(refreshToken, timeout);
}

// Stop the refresh token timer
function stopRefreshTokenTimer() {
  clearTimeout(refreshTokenTimeout);
}
