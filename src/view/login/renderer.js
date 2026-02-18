import { LoginView } from "./loginView.js";
import { LoginController } from "../../controller/auth/login/login.controller.js";

const view = new LoginView();
const controller = new LoginController(view);

controller.init();