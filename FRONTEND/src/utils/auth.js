export const logout = () => {
  try {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  } catch (e) {
    // Ignore storage errors
  }

  // Hard redirect to clear in-memory state and go back to login
  window.location.href = "/login";
};
