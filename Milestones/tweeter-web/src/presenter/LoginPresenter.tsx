import { UserService } from "../model.service/UserService";
import { AuthView, AuthPresenter } from "./AuthPresenter";

export interface LoginView extends AuthView {
  displayErrorMessage: (message: string) => void;
}

export class LoginPresenter extends AuthPresenter<LoginView> {
  private userService: UserService = new UserService();

  public async doLogin(
    props: { originalUrl?: string },
    alias: string,
    password: string,
  ) {
    this.handleAuthOperation(
      () => this.userService.login(alias, password),
      "log user in",
      (user) => props.originalUrl ?? `/feed/${user.alias}`,
    );
  }

  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  }

  public loginOnEnter(
    event: React.KeyboardEvent<HTMLElement>,
    props: { originalUrl?: string },
    alias: string,
    password: string,
  ) {
    if (
      event.key == "Enter" &&
      !this.checkSubmitButtonStatus(alias, password)
    ) {
      this.doLogin(props, alias, password);
    }
  }
}
