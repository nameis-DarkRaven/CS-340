import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ) => string;
  deleteMessage: (messageId: string) => void;
  navigate: (to: string) => void;
  setDisplayedUser: (user: User) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter {
  private view: UserInfoView;
  private service: FollowService;
  private isFollower: boolean;
  private followerCount: number;
  private followeeCount: number;

  public constructor(view: UserInfoView) {
    this.view = view;
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
    try {
      if (currentUser === displayedUser) {
        this.isFollower = false;
      } else {
        this.isFollower = await this.getIsFollowerStatus(
          authToken,
          currentUser,
          displayedUser,
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`,
      );
    }
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
    try {
      this.followeeCount = await this.getFolloweeCount(
        authToken,
        displayedUser,
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`,
      );
    }
  }

  private async getFolloweeCount(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<number> {
    return this.service.getFolloweeCount(authToken, displayedUser);
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this.followerCount = await this.getFollowerCount(
        authToken,
        displayedUser,
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`,
      );
    }
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

    try {
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
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(followingUserToast);
      this.view.setIsLoading(false);
    }
  }

  private async follow(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, displayedUser);
    const followeeCount = await this.getFolloweeCount(authToken, displayedUser);

    return [followerCount, followeeCount];
  }

  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    event.preventDefault();

    var unfollowingUserToast = "";

    try {
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
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(unfollowingUserToast);
      this.view.setIsLoading(false);
    }
  }

  private async unfollow(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, displayedUser);
    const followeeCount = await this.getFolloweeCount(authToken, displayedUser);

    return [followerCount, followeeCount];
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
