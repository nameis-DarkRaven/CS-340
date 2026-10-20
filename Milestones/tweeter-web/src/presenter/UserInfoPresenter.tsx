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
    this.doFailureReportingOperation(async () => {
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

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.followeeCount = await this.getFolloweeCount(
        authToken,
        displayedUser,
      );
    }, "get followee count");
  }

  private async getFolloweeCount(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<number> {
    return this.service.getFolloweeCount(authToken, displayedUser);
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.followerCount = await this.getFollowerCount(
        authToken,
        displayedUser,
      );
    }, "get follower count");
  }

  private async getFollowerCount(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<number> {
    return this.service.getFollowerCount(authToken, displayedUser);
  }

  public async followDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    event.preventDefault();

    var followingUserToast = "";
    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        followingUserToast = this.view.displayInfoMessage(
          `Following ${displayedUser!.name}...`,
          0,
        );

        const [followerCount, followeeCount] = await this.follow(
          authToken,
          displayedUser,
        );

        this.isFollower = true;
        this.followerCount = followerCount;
        this.followeeCount = followeeCount;
      },
      "follow user",
      () => this.finallyDo(followingUserToast),
    );
  }

  protected finallyDo(message: string): void {
    this.view.deleteMessage(message);
    this.view.setIsLoading(false);
  }

  private async follow(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.service.follow(authToken, displayedUser);
  }

  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    event.preventDefault();

    var unfollowingUserToast = "";
    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        unfollowingUserToast = this.view.displayInfoMessage(
          `Unfollowing ${displayedUser!.name}...`,
          0,
        );

        const [followerCount, followeeCount] = await this.unfollow(
          authToken,
          displayedUser,
        );
        this.isFollower = false;
        this.followerCount = followerCount;
        this.followeeCount = followeeCount;
      },
      "unfollow user",
      () => this.finallyDo(unfollowingUserToast),
    );
  }

  private async unfollow(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.service.unfollow(authToken, displayedUser);
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
