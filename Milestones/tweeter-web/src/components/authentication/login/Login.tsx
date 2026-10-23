import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { LoginPresenter } from "../../../presenter/LoginPresenter";
import { useRef, useState } from "react";
import {
  AuthView,
  LoginFormData,
} from "../../../presenter/AuthPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const formData: LoginFormData = {
    alias,
    password,
    originalUrl: props.originalUrl,
  };
  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const observer: AuthView = {
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
    updateUserInfo: updateUserInfo,
    setIsLoading: setIsLoading,
  };

  const presenterRef = useRef<LoginPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new LoginPresenter(observer);
  }

  const inputFieldFactory = () => {
    return (
      <>
        <AuthenticationFields
          originalUrl={props.originalUrl}
          actionOnEnter={(event) =>
            presenterRef.current!.loginOnEnter(event, formData)
          }
          setAlias={setAlias}
          setPassword={setPassword}
        />
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={(rememberMe) =>
        (presenterRef.current!.RememberMe = rememberMe)
      }
      submitButtonDisabled={() =>
        presenterRef.current!.checkSubmitButtonStatus(formData)
      }
      isLoading={isLoading}
      submit={() => presenterRef.current!.doLogin(formData)}
    />
  );
};

export default Login;
