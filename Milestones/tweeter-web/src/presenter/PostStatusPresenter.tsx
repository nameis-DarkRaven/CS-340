import { User, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface PostStatusView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ) => string;
  deleteMessage: (toastId: string) => void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter {
  private view: PostStatusView;
  private service: StatusService;
  private isLoading: boolean;

  public constructor(view: PostStatusView) {
    this.view = view;
    this.service = new StatusService();
    this.isLoading = false;
  }

  public async submitPost(
    event: React.MouseEvent,
    authToken: AuthToken,
    currentUser: User,
    post: string,
  ) {
    event.preventDefault();

    var postingStatusToastId = "";

    try {
      this.isLoading = true;
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0,
      );

      const status = new Status(post, currentUser!, Date.now());

      await this.service.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.isLoading = false;
    }
  }

  public clearPost(event: React.MouseEvent) {
    event.preventDefault();
    this.view.setPost("");
  }

  public checkButtonStatus(
    authToken: AuthToken,
    currentUser: User,
    post: string,
  ): boolean {
    return !post.trim() || !authToken || !currentUser;
  }

  public get IsLoading(): boolean {
    return this.isLoading;
  }
}
