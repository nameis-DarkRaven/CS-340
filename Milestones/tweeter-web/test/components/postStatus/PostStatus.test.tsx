import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { User } from "tweeter-shared/dist/model/domain/User";

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));
jest.mock("../../../src/components/toaster/MessageHooks", () => ({
  useMessageActions: () => ({
    displayInfoMessage: jest.fn(() => "messageId"),
    displayErrorMessage: jest.fn(),
    deleteMessage: jest.fn(),
  }),
}));

describe("PostStatus Component", () => {
  const authToken = new AuthToken("abc", Date.now());
  const testUser = new User("first", "last", "test@example.com", "image");

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: testUser,
      authToken: authToken,
    });
  });

  it("starts with Post Status and Clear buttons disabled", () => {
    const { postButton, clearButton } = renderPostStatusAndGetElements();

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when the text field has text", async () => {
    const { user, postButton, clearButton, postField } =
      renderPostStatusAndGetElements();

    await user.type(postField, "status");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when the text field is cleared", async () => {
    const { user, postButton, clearButton, postField } =
      renderPostStatusAndGetElements();

    await user.type(postField, "status");
    await user.click(clearButton);

    expect(postField).toHaveValue("");
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();

    await user.type(postField, "status");
    await user.clear(postField);

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's postStatus method with correct parameters when the Post Status button is pressed", async () => {
    const submitPostSpy = jest
      .spyOn(PostStatusPresenter.prototype, "submitPost")
      .mockResolvedValue(undefined);
    const {
      user: userActions,
      postButton,
      postField,
    } = renderPostStatusAndGetElements();
    const post = "status";

    await userActions.type(postField, post);
    await userActions.click(postButton);

    expect(submitPostSpy).toHaveBeenCalledWith(
      expect.anything(),
      authToken,
      testUser,
      post,
    );
  });
});

function renderPostStatusAndGetElements() {
  const user = userEvent.setup();
  render(<PostStatus />);

  const postButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const postField = screen.getByRole("textbox");

  return { user, postButton, clearButton, postField };
}


