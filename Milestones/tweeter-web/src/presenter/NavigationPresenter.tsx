import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface NavigationView extends View {
  navigate: (path: string) => void;
  setDisplayedUser: (user: User) => void;
}

export class NavigationPresenter extends Presenter<NavigationView> {
  private service: UserService;

  constructor(view: NavigationView) {
    super(view);
    this.service = new UserService();
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
    this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(event.target.toString());
      const toUser = await this.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    }, "get user");
  }
}
