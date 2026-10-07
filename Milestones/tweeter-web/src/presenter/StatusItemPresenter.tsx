import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface StatusItemView {
  addItems: (newItems: Status[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {
  private _view: StatusItemView;
  private _hasMoreItems: boolean = true;
  private _lastItem: Status | null = null;
  private userService: UserService;

  protected constructor(view: StatusItemView) {
    this._view = view;
    this.userService = new UserService();
  }

  protected get view(): StatusItemView {
    return this._view;
  }

  protected get lastItem(): Status | null {
    return this._lastItem;
  }

  protected set lastItem(lastItem: Status | null) {
    this._lastItem = lastItem;
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(hasMore: boolean) {
    this._hasMoreItems = hasMore;
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
