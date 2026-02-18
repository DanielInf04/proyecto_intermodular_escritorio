export class LoginController {
  constructor(view) {
    this.view = view;
  }

  init() {
    // conectar callbacks de la vista
    this.view.onSubmitHandler = this.handleSubmit.bind(this);
    this.view.onTogglePasswordHandler = this.handleTogglePassword.bind(this);

    // inicializar vista (DOM + listeners)
    this.view.init();

    // cargar remember me (solo email)
    this.loadRememberMe();
  }

  loadRememberMe() {
    const savedEmail = localStorage.getItem("remember_email");
    const savedRemember = localStorage.getItem("remember_enabled");

    if (savedRemember === "1") {
      this.view.setRememberMeChecked(true);
      if (savedEmail) this.view.setEmail(savedEmail);
    } else {
      this.view.setRememberMeChecked(false);
    }
  }

  saveRememberMe(email) {
    const remember = this.view.isRememberMeChecked();

    if (remember) {
      localStorage.setItem("remember_enabled", "1");
      localStorage.setItem("remember_email", email);
    } else {
      localStorage.setItem("remember_enabled", "0");
      localStorage.removeItem("remember_email");
    }
  }

  handleTogglePassword() {
    const visible = !this.view.isPasswordVisible();
    this.view.setPasswordVisible(visible);
  }

  async handleSubmit() {
    const email = this.view.getEmail();
    const password = this.view.getPassword();

    this.saveRememberMe(email);

    if (!email || !password) {
      console.warn("Email o password vacíos");
      return;
    }

    this.view.setLoading(true);

    try {
      const result = await window.api.auth.login(email, password);
      console.log("LOGIN OK:", result);

      await window.api.ui.openPanel();
      window.close();
    } catch (err) {
      this.view.showError(err);
    } finally {
      this.view.setLoading(false);
    }
  }
}