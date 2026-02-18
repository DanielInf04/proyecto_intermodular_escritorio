export class LoginView {
  constructor() {
    this.form = null;
    this.emailInput = null;
    this.passwordInput = null;
    this.loginBtn = null;
    this.togglePasswordBtn = null;
    this.rememberMe = null;

    // callbacks (inyectados por el controller)
    this.onSubmitHandler = null;
    this.onTogglePasswordHandler = null;
  }

  init() {
    this.form = document.getElementById("loginForm");
    this.emailInput = document.getElementById("email");
    this.passwordInput = document.getElementById("password");
    this.loginBtn = document.getElementById("loginBtn");
    this.togglePasswordBtn = document.getElementById("togglePassword");
    this.rememberMe = document.getElementById("rememberMe");

    if (!this.form) {
      console.error("LoginView: no se encontró #loginForm");
      return;
    }

    // Eventos -> delegados al controller (si están asignados)
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.onSubmitHandler?.(e);
    });

    if (this.togglePasswordBtn) {
      this.togglePasswordBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.onTogglePasswordHandler?.(e);
      });
    }
  }

  // ====== Métodos de UI ======

  getEmail() {
    return this.emailInput?.value.trim() ?? "";
  }

  setEmail(value) {
    if (this.emailInput) this.emailInput.value = value ?? "";
  }

  getPassword() {
    return this.passwordInput?.value ?? "";
  }

  isRememberMeChecked() {
    return this.rememberMe?.checked === true;
  }

  setRememberMeChecked(value) {
    if (this.rememberMe) this.rememberMe.checked = !!value;
  }

  setPasswordVisible(visible) {
    if (!this.passwordInput) return;

    this.passwordInput.type = visible ? "text" : "password";

    if (this.togglePasswordBtn) {
      this.togglePasswordBtn.textContent = visible ? "Ocultar" : "Mostrar";
      this.togglePasswordBtn.setAttribute(
        "aria-label",
        visible ? "Ocultar contraseña" : "Mostrar contraseña"
      );
    }
  }

  isPasswordVisible() {
    return this.passwordInput?.type === "text";
  }

  setLoading(loading) {
    if (!this.loginBtn) return;
    this.loginBtn.disabled = loading;
    this.loginBtn.classList.toggle("loading", loading);
  }

  showError(err) {
    // Mantén simple; si luego quieres toast, lo cambias aquí
    console.error("LOGIN ERROR:", err?.message || err);
    console.error("STATUS:", err?.status);
    console.error("DATA:", err?.data);
  }
}