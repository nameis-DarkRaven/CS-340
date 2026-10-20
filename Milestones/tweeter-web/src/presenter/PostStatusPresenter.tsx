import { User, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { Presenter, MessageView } from "./Presenter";

export interface PostStatusView extends MessageView {
  setPost: (post: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private service: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this.service = new StatusService();
  }

  public async submitPost(
    event: React.MouseEvent,
    authToken: AuthToken,
    currentUser: User,
    post: string,
  ) {
    event.preventDefault();

    var postingStatusToastId = "";

    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        postingStatusToastId = this.view.displayInfoMessage(
          "Posting status...",
          0,
        );

        const status = new Status(post, currentUser!, Date.now());

        await this.service.postStatus(authToken!, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      () => this.finallyDo(postingStatusToastId),
    );
  }

  protected finallyDo(message: string): void {
    this.view.deleteMessage(message);
    this.view.setIsLoading(false);
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
}
