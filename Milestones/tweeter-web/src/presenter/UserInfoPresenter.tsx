import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  navigate: (to: string) => void;
  setDisplayedUser: (user: User) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService;
  private isFollower: boolean;
  private followerCount: number;
  private followeeCount: number;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
    this.isFollower = false;
    this.followerCount = 0;
    this.followeeCount = 0;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.isFollower = false;
      } else {
        this.isFollower = await this.getIsFollowerStatus(
          authToken,
          currentUser,
          displayedUser,
        );
      }
    }, "determine follower status");
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ): Promise<boolean> {
    return this.service.getIsFollowerStatus(
      authToken,
      currentUser,
      displayedUser,
    );
  }

  private async getFolloweeCount(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<number> {
    return this.service.getFolloweeCount(authToken, displayedUser);
  }

  private async getFollowerCount(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<number> {
    return this.service.getFollowerCount(authToken, displayedUser);
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.followeeCount = await this.getFolloweeCount(
        authToken,
        displayedUser,
      );
    }, "get followee count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.followerCount = await this.getFollowerCount(
        authToken,
        displayedUser,
      );
    }, "get follower count");
  }

  private async changeFollowStatus(
    event: React.MouseEvent,
    displayedUser: User,
    following: boolean,
    operation: () => Promise<[followerCount: number, followeeCount: number]>,
  ): Promise<void> {
    event.preventDefault();

    let toastId = "";
    const action = following
      ? { description: "follow user", progress: "Following" }
      : { description: "unfollow user", progress: "Unfollowing" };

    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        toastId = this.view.displayInfoMessage(
          `${action.progress} ${displayedUser.name}...`,
          0,
        );

        [this.followerCount, this.followeeCount] = await operation();
        this.isFollower = following;
      },
      action.description,
      () => this.finallyDo(toastId),
    );
  }

  public followDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    return this.changeFollowStatus(event, displayedUser, true, () =>
      this.service.follow(authToken, displayedUser),
    );
  }

  public unfollowDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    return this.changeFollowStatus(event, displayedUser, false, () =>
      this.service.unfollow(authToken, displayedUser),
    );
  }

  protected finallyDo(message: string): void {
    this.view.deleteMessage(message);
    this.view.setIsLoading(false);
  }

  public set IsFollower(isFollower: boolean) {
    this.isFollower = isFollower;
  }

  public get IsFollower(): boolean {
    return this.isFollower;
  }

  public set FollowerCount(followerCount: number) {
    this.followerCount = followerCount;
  }

  public get FollowerCount(): number {
    return this.followerCount;
  }

  public set FolloweeCount(followeeCount: number) {
    this.followeeCount = followeeCount;
  }

  public get FolloweeCount(): number {
    return this.followeeCount;
  }
}
