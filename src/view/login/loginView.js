export class LoginView {

    constructor() {
        this.form = null;
        this.emailInput = null;
        this.passwordInput = null;
        this.loginBtn = null;
    }

    init() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.loginBtn = document.getElementById('loginBtn');

        if (!this.form) {
            console.error('LoginView: no se encontró #loginForm');
            return;
        }

        this.form.addEventListener('submit', this.onSubmit.bind(this));
    }

    async onSubmit(e) {
        e.preventDefault();

        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;

        if (!email || !password) {
        console.warn('Email o password vacíos');
        return;
        }

        this.setLoading(true);

        try {
            const result = await window.api.auth.login(email, password);
            console.log('LOGIN OK:', result);

            // abrimos el panel de administración
            await window.api.ui.openPanel();
            window.close();
        } catch (err) {
            console.error('LOGIN ERROR:', err.message || err);
            // aquí luego pintas un toast o mensaje
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        if (!this.loginBtn) return;
        this.loginBtn.disabled = loading;
        this.loginBtn.classList.toggle('loading', loading);
    }


}