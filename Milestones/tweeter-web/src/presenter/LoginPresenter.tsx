import { UserService } from "../model.service/UserService";
import {
  AuthView,
  AuthPresenter,
  LoginFormData,
} from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter<AuthView> {
  private userService: UserService = new UserService();

  public async doLogin(formData: LoginFormData) {
    this.handleAuthOperation(
      () => this.userService.login(formData.alias, formData.password),
      "log user in",
      (user) => formData.originalUrl ?? `/feed/${user.alias}`,
    );
  }

  public loginOnEnter(
    event: React.KeyboardEvent<HTMLElement>,
    formData: LoginFormData,
  ) {
    this.doOperationOnEnter(
      event,
      () => this.doLogin(formData),
      () => this.checkSubmitButtonStatus(formData),
    );
  }

  public checkSubmitButtonStatus(formData: LoginFormData): boolean {
    return !formData.alias || !formData.password;
  }
}
