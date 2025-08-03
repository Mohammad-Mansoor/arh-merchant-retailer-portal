export const validateToken = (token) => {
  if (!token) {
    return { valid: false, error: "Token is missing" };
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return { valid: false, error: "Invalid token structure" };
  }

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);

    if (!payload.exp) {
      return { valid: false, error: "Token has no expiration field (exp)" };
    }

    const now = Date.now() / 1000;
    if (payload.exp < now) {
      return { valid: false, error: "Token has expired" };
    }

    return {
      valid: true,
      error: null,
      payload, // return decoded payload for use (like user info)
    };
  } catch (err) {
    return { valid: false, error: "Failed to decode token" };
  }
};
