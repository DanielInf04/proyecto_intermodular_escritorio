const api = require('./apiClient');

async function login(username, password) {
    const data = await api.request('/auth/login', {
        method: 'POST',
        body: { username, password }
    });

    if (data?.token) api.setToken(data.token);
    return data;
}

module.exports = { login };