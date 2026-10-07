import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useNavigate } from "react-router-dom";
import {
  NavigationPresenter,
  NavigationView,
} from "../../presenter/NavigationPresenter";
import { useRef } from "react";

export const useUserNavigation = () => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();

  const observer: NavigationView = {
    displayErrorMessage,
    navigate,
    setDisplayedUser,
  };

  const presenterRef = useRef<NavigationPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new NavigationPresenter(observer);
  }

  const navigateToUser = async (
    event: React.MouseEvent,
    featurePath: string,
  ): Promise<void> => {
    event.preventDefault();
    presenterRef.current!.navigateToUser(
      event,
      featurePath,
      authToken!,
      displayedUser!,
    );
  };

  return { navigateToUser };
};
