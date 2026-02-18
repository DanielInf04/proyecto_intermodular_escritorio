const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
const TOKEN_KEY = "auth_token";

let storePromise = null;

async function getStore() {
  if (!storePromise) {
    storePromise = import("electron-store").then((mod) => new mod.default());
  }
  return storePromise;
}

async function setToken(newToken) {
  const store = await getStore();
  if (newToken) store.set(TOKEN_KEY, newToken);
  else store.delete(TOKEN_KEY);
}

async function getToken() {
  const store = await getStore();
  return store.get(TOKEN_KEY, null);
}

function isFormData(body) {
  return !!body && typeof body.append === "function" && typeof body.get === "function";
}

function isPublicAuthPath(path) {
  return (
    path.startsWith("/auth/login") ||
    path.startsWith("/auth/register")
  );
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const multipart = isFormData(body);
  const t = await getToken();

  const finalHeaders = {
    ...(!isPublicAuthPath(path) && t ? { Authorization: `Bearer ${t}` } : {}),
    ...headers,
  };

  console.log("[apiClient]", method, path, "hasToken:", !!t, "isMultipart:", multipart);
  console.log("[apiClient] Authorization:", finalHeaders.Authorization);

  if (method === "POST" && path.startsWith("/api/categories")) {
    console.log("[apiClient] POST categories token?", !!t);
    console.log("[apiClient] headers:", finalHeaders);
  }

  // ✅ Solo JSON si NO es multipart
  if (!multipart && body && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    // ✅ NO stringify si es FormData
    body: body
      ? (multipart ? body : (typeof body === "string" ? body : JSON.stringify(body)))
      : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    let serverMsg = null;

    if (isJson && data?.message) {
      serverMsg = data.message;
    } else if (typeof data === "string" && data.trim()) {
      serverMsg = data;
    }

    const err = new Error(serverMsg || "Error en la petición");
    err.status = res.status;
    throw err;
  }

  return data;
}

async function requestWithMeta(path, { method = "GET", body, headers = {} } = {}) {
  const multipart = isFormData(body);
  const t = await getToken();

  const finalHeaders = {
    ...(!isPublicAuthPath(path) && t ? { Authorization: `Bearer ${t}` } : {}),
    ...headers,
  };

  if (!multipart && body && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body
      ? (multipart ? body : (typeof body === "string" ? body : JSON.stringify(body)))
      : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const serverMsg =
      (isJson && data?.message) ? data.message :
      (typeof data === "string" && data.trim() ? data : null);

    const err = new Error(serverMsg || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  const totalCount = Number(res.headers.get("x-total-count") ?? 0);
  const totalPages = Number(res.headers.get("x-total-pages") ?? 0);

  return { data, meta: { totalCount, totalPages } };
}

async function clearToken() {
  const store = await getStore();
  store.delete(TOKEN_KEY);
}

module.exports = { request, requestWithMeta, setToken, getToken, clearToken };