import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import {
  RegisterPresenter,
  RegisterView,
} from "../../../presenter/RegisterPresenter";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const observer: RegisterView = {
    navigate: navigate,
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage,
    setIsLoading: setIsLoading,
    setImageUrl: setImageUrl,
  };

  const presenterRef = useRef<RegisterPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new RegisterPresenter(observer);
  }

  const inputFieldFactory = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onKeyDown={(event) =>
              presenterRef.current!.registerOnEnter(
                event,
                firstName,
                lastName,
                alias,
                password,
                imageUrl,
              )
            }
            onChange={(event) => setFirstName(event.target.value)}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onKeyDown={(event) =>
              presenterRef.current!.registerOnEnter(
                event,
                firstName,
                lastName,
                alias,
                password,
                imageUrl,
              )
            }
            onChange={(event) => setLastName(event.target.value)}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        <AuthenticationFields
          actionOnEnter={(event) =>
            presenterRef.current!.registerOnEnter(
              event,
              firstName,
              lastName,
              alias,
              password,
              imageUrl,
            )
          }
          setAlias={(alias) => setAlias(alias)}
          setPassword={(password) => setPassword(password)}
        />
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={(event) =>
              presenterRef.current!.registerOnEnter(
                event,
                firstName,
                lastName,
                alias,
                password,
                imageUrl,
              )
            }
            onChange={(event) => presenterRef.current!.handleFileChange(event)}
          />
          {imageUrl.length > 0 && (
            <>
              <label htmlFor="imageFileInput">User Image</label>
              <img src={imageUrl} className="img-thumbnail" alt=""></img>
            </>
          )}
        </div>
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Algready registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={(rememberMe) =>
        (presenterRef.current!.RememberMe = rememberMe)
      }
      submitButtonDisabled={() =>
        presenterRef.current!.checkSubmitButtonStatus(
          firstName,
          lastName,
          alias,
          password,
          imageUrl,
        )
      }
      isLoading={isLoading}
      submit={() =>
        presenterRef.current!.doRegister(firstName, lastName, alias, password)
      }
    />
  );
};

export default Register;
