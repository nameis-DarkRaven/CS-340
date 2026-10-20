import "./PostStatus.css";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHooks";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../presenter/PostStatusPresenter";
import { useRef, useState } from "react";

const PostStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState("");
  const { displayInfoMessage, displayErrorMessage, deleteMessage } =
    useMessageActions();

  const { authToken, currentUser } = useUserInfo();

  const observer: PostStatusView = {
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    deleteMessage: deleteMessage,
    setPost: setPost,
    setIsLoading: setIsLoading,
  };
  const presenterRef = useRef<PostStatusPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new PostStatusPresenter(observer);
  }

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => setPost(event.target.value)}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={presenterRef.current!.checkButtonStatus(
            authToken!,
            currentUser!,
            post,
          )}
          style={{ width: "8em" }}
          onClick={(event) =>
            presenterRef.current!.submitPost(
              event,
              authToken!,
              currentUser!,
              post,
            )
          }
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={presenterRef.current!.checkButtonStatus(
            authToken!,
            currentUser!,
            post,
          )}
          onClick={(event) => presenterRef.current!.clearPost(event)}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
