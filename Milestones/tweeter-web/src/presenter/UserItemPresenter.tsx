import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserItemView {
  addItems: (newItems: User[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class UserItemPresenter {
  private _view: UserItemView;
  private _hasMoreItems: boolean = true;
  private _lastItem: User | null = null;
  private userService: UserService;

  protected constructor(view: UserItemView) {
    this._view = view;
    this.userService = new UserService();
  }

  protected get view(): UserItemView {
    return this._view;
  }

  protected get lastItem(): User | null {
    return this._lastItem;
  }

  protected set lastItem(lastItem: User | null) {
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
