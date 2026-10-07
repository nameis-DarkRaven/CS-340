import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface NavigationView {
  displayErrorMessage: (message: string) => void;
  navigate: (path: string) => void;
  setDisplayedUser: (user: User) => void;
}

export class NavigationPresenter {
  private service: UserService;
  private view: NavigationView;
  constructor(view: NavigationView) {
    this.service = new UserService();
    this.view = view;
  }

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    return this.service.getUser(authToken, alias);
  }

  extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  public async navigateToUser(
    event: React.MouseEvent,
    featurePath: string,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    try {
      const alias = this.extractAlias(event.target.toString());
      const toUser = await this.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`,
      );
    }
  }
}
