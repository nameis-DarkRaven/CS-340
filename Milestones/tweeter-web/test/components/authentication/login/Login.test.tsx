import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { deepEqual, instance, mock, verify } from "@typestrong/ts-mockito";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fab);

describe("Login Component", () => {
  it("starts with sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });
  it("enables sign-in button when both the alias and password fields have text", async () => {
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElements("/");
    await user.type(aliasField, "a");
    await user.type(passwordField, "b");
    expect(signInButton).toBeEnabled();
  });
  it("disables sign-in button if either the alias or password field is cleared", async () => {
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElements("/");
    await user.type(aliasField, "a");
    await user.type(passwordField, "b");
    expect(signInButton).toBeEnabled();
    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();
    await user.clear(passwordField);
    await user.type(aliasField, "a");
    expect(signInButton).toBeDisabled();
  });
  it("calls the presenter's login method with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "https://somewhere.com";
    const alias = "abc";
    const password = "abc123";
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElements(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);

    verify(
      mockPresenter.doLogin(deepEqual({ alias, password, originalUrl })),
    ).once();
  });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>,
  );
}

function renderLoginAndGetElements(
  originalUrl: string,
  presenter?: LoginPresenter,
) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign In/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordField };
}
