//const BASE_URL = process.env.BASE_URL || "https://dummyjson.com";
const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

let token = null;

function setToken(newToken) {
    token = newToken
}

function isFormData(body) {
  return !!body && typeof body.append === "function" && typeof body.get === "function";
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const multipart = isFormData(body);

  const finalHeaders = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

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
    const serverMsg =
      (isJson && data?.message) ? data.message :
      (typeof data === "string" && data.trim() ? data : null);

    const err = new Error(serverMsg || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

async function requestWithMeta(path, { method = "GET", body, headers = {} } = {}) {
  const multipart = isFormData(body);

  const finalHeaders = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

/*async function request(path, { method = 'GET', body, headers = {} } = {}) {
    console.log('LOGIN URL:', `${BASE_URL}/auth/login`);
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
        const msg = isJson && data?.message ? data.message : `HTTP ${res.status}`;
        const err = new Error(msg);
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}
async function requestWithMeta(path, { method = 'GET', body, headers = {} } = {}) {
    
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
        const msg = isJson && data?.message ? data.message : `HTTP ${res.status}`;
        const err = new Error(msg);
        err.status = res.status;
        err.data = data;
        throw err;
    }

    // OJO: en fetch los headers no distinguen mayúsculas/minúsculas
    const totalCount = Number(res.headers.get('x-total-count') ?? 0);
    const totalPages = Number(res.headers.get('x-total-pages') ?? 0);

    return { data, meta: { totalCount, totalPages } };
}*/


module.exports = { request, requestWithMeta, setToken };