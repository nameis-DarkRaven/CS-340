import { Buffer } from "buffer";
import { ChangeEvent } from "react";
import { UserService } from "../model.service/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface RegisterView extends AuthView {
  setImageUrl: (imageUrl: string) => void;
}

export class RegisterPresenter extends AuthPresenter<RegisterView> {
  private service: UserService = new UserService();
  private imageBytes: Uint8Array = new Uint8Array();
  private imageFileExtension: string = "";

  public checkSubmitButtonStatus(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
  ): boolean {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !this.imageFileExtension
    );
  }

  public registerOnEnter(
    event: React.KeyboardEvent<HTMLElement>,
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
  ) {
    if (
      event.key == "Enter" &&
      !this.checkSubmitButtonStatus(
        firstName,
        lastName,
        alias,
        password,
        imageUrl,
      )
    ) {
      {
        this.doRegister(firstName, lastName, alias, password);
      }
    }
  }

  public handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    this.handleImageFile(file);
  };

  private handleImageFile(file: File | undefined): void {
    if (!file) {
      this.view.setImageUrl("");
      this.imageBytes = new Uint8Array();
      return;
    }

    this.view.setImageUrl(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const base64 = (event.target?.result as string).split("base64,")[1];
      this.imageBytes = Buffer.from(base64, "base64");
    };
    reader.readAsDataURL(file);

    const fileExtension = file.name.split(".").pop();
    if (fileExtension) this.imageFileExtension = fileExtension;
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
  ) {
    this.handleAuthOperation(
      () =>
        this.service.register(
          firstName,
          lastName,
          alias,
          password,
          this.imageBytes,
          this.imageFileExtension,
        ),
      "register user",
      (user) => `/feed/${user.alias}`,
    );
  }
}
