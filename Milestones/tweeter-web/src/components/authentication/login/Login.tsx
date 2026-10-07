import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { LoginPresenter, LoginView } from "../../../presenter/LoginPresenter";
import { useRef, useState } from "react";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const observer: LoginView = {
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
    updateUserInfo: updateUserInfo,
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
            presenterRef.current!.loginOnEnter(event, props, alias, password)
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
        presenterRef.current!.checkSubmitButtonStatus(alias, password)
      }
      isLoading={presenterRef.current!.IsLoading}
      submit={() => presenterRef.current!.doLogin(props, alias, password)}
    />
  );
};

export default Login;
