import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { User } from "tweeter-shared/dist/model/domain/User";
import { StatusService } from "../../src/model.service/StatusService";
import { Status } from "tweeter-shared/dist/model/domain/Status";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;

  const event = {
    preventDefault: jest.fn(),
  } as unknown as React.MouseEvent;
  const authToken = new AuthToken("abc", Date.now());
  const currentUser = new User(
    "testuser",
    "Test User",
    "testuser@example.com",
    "image",
  );
  const post = "This is a test post";

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn(
      "messageId",
    );

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance),
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockService = mock<StatusService>();
    when(postStatusPresenterSpy.service).thenReturn(instance(mockService));
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(event, authToken, currentUser, post);
    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0),
    ).once();
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });
  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(event, authToken, currentUser, post);

    verify(mockService.postStatus(authToken, anything())).once();

    const [, status] = capture(mockService.postStatus).last();
    expect(status.post).toBe(post);
    expect(status.user).toBe(currentUser);
  });
  it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when successful", async () => {
    await postStatusPresenter.submitPost(event, authToken, currentUser, post);

    verify(mockPostStatusView.deleteMessage("messageId")).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000),
    ).once();
    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });
  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when unsuccessful", async () => {
    const error = new Error("Post failed");
    when(mockService.postStatus(authToken, anything())).thenThrow(error);
    await postStatusPresenter.submitPost(event, authToken, currentUser, post);

    verify(
      mockPostStatusView.displayErrorMessage(
        `Failed to post the status because of exception: ${error.message}`,
      ),
    ).once();

    verify(mockPostStatusView.setPost("")).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000),
    ).never();
  });
});
