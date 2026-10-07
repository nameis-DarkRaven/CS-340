import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LoginView {
  displayErrorMessage: (message: string) => void;
  navigate: (featurePath: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean,
  ) => void;
}

export class LoginPresenter {
  private isLoading: boolean;
  private view: LoginView;
  private userService: UserService;
  private rememberMe: boolean;

  public constructor(view: LoginView) {
    this.view = view;
    this.isLoading = false;
    this.userService = new UserService();
    this.rememberMe = false;
  }

  public async doLogin(
    props: { originalUrl?: string },
    alias: string,
    password: string,
  ) {
    try {
      this.isLoading = true;

      const [user, authToken] = await this.userService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, this.rememberMe);

      if (!!props.originalUrl) {
        this.view.navigate(props.originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`,
      );
    } finally {
      this.isLoading = false;
    }
  }

  public checkSubmitButtonStatus = (
    alias: string,
    password: string,
  ): boolean => {
    return !alias || !password;
  };

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

  public set RememberMe(rememberMe: boolean) {
    this.rememberMe = rememberMe;
  }

  public get IsLoading(): boolean {
    return this.isLoading;
  }
}
