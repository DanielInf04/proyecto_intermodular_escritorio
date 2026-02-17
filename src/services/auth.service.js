const api = require('./apiClient');

async function login(email, password) {
    const data = await api.request('/auth/login', {
        method: 'POST',
        body: { email, password }
    });

    if (data?.token) api.setToken(data.token);
    return data;
}

module.exports = { login };