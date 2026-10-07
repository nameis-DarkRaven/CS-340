import "./UserInfoComponent.css";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import {
  UserInfoPresenter,
  UserInfoView,
} from "../../presenter/UserInfoPresenter";
import { User } from "tweeter-shared";

const UserInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { displayErrorMessage, displayInfoMessage, deleteMessage } =
    useMessageActions();

  const { currentUser, authToken, displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const location = useLocation();

  const observer: UserInfoView = {
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    deleteMessage: deleteMessage,
    navigate: navigate,
    setDisplayedUser: setDisplayedUser,
    setIsLoading: setIsLoading,
  };
  const presenterRef = useRef<UserInfoPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserInfoPresenter(observer);
  }

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  const switchToLoggedInUser = (event: React.MouseEvent, currentUser: User) => {
    event.preventDefault();
    setDisplayedUser(currentUser);
    navigate(`${getBaseUrl()}/${currentUser.alias}`);
  };

  const getBaseUrl = (): string => {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };

  useEffect(() => {
    presenterRef.current!.setIsFollowerStatus(
      authToken!,
      currentUser!,
      displayedUser!,
    );
    presenterRef.current!.setNumbFollowees(authToken!, displayedUser!);
    presenterRef.current!.setNumbFollowers(authToken!, displayedUser!);
  }, [displayedUser]);

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {!displayedUser.equals(currentUser) && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={`./${currentUser.alias}`}
                    onClick={(event) =>
                      switchToLoggedInUser(event, currentUser!)
                    }
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {presenterRef.current!.FolloweeCount > -1 &&
                presenterRef.current!.FollowerCount > -1 && (
                  <div>
                    Followees: {presenterRef.current!.FolloweeCount} Followers:{" "}
                    {presenterRef.current!.FollowerCount}
                  </div>
                )}
            </div>
            <form>
              {!displayedUser.equals(currentUser) && (
                <div className="form-group">
                  {presenterRef.current!.IsFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(event) =>
                        presenterRef.current!.unfollowDisplayedUser(
                          event,
                          authToken!,
                          displayedUser!,
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
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(event) =>
                        presenterRef.current!.followDisplayedUser(
                          event,
                          authToken!,
                          displayedUser!,
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
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
