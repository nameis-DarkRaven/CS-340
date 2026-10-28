import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface AuthView extends View {
  navigate: (path: string) => void;
  updateUserInfo: (
    user: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean,
  ) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export interface AuthCredentials {
  alias: string;
  password: string;
}

export interface LoginFormData extends AuthCredentials {
  originalUrl?: string;
}

export interface RegistrationFormData extends AuthCredentials {
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export abstract class AuthPresenter<V extends AuthView> extends Presenter<V> {
  protected rememberMe: boolean = false;

  protected async handleAuthOperation(
    operation: () => Promise<[User, AuthToken]>,
    description: string,
    getRedirectPath: (user: User) => string,
  ) {
    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await operation();

        this.view.updateUserInfo(user, user, authToken, this.rememberMe);
        this.view.navigate(getRedirectPath(user));
      },
      description,
      () => this.view.setIsLoading(false),
    );
  }

  protected async doOperationOnEnter(
    event: React.KeyboardEvent<HTMLElement>,
    operation: () => Promise<void>,
    checkSubmitButtonStatus: () => boolean,
  ) {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      await operation();
    }
  }

  public set RememberMe(value: boolean) {
    this.rememberMe = value;
  }
}
