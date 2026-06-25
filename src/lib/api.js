const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://study-nook-server-ashy.vercel.app";

function getCookie(name) {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const token =
    getCookie("better-auth.session_token") ||
    getCookie("__secure-better-auth.session_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const defaultOptions = {
    headers,
    credentials: "include", // Ensures Better Auth session cookies are sent
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred while fetching data.");
    }

    return data;
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error);
    throw error;
  }
}
