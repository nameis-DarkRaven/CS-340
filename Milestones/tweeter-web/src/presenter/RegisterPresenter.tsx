import { Buffer } from "buffer";
import { ChangeEvent } from "react";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { User } from "tweeter-shared/dist/model/domain/User";
import { UserService } from "../model.service/UserService";

export interface RegisterView {
  navigate: (path: string) => void;
  updateUserInfo: (
    user: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean,
  ) => void;
  displayErrorMessage: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setImageUrl: (imageUrl: string) => void;
}

export class RegisterPresenter {
  private view: RegisterView;
  private service: UserService;
  private imageBytes: Uint8Array;
  private rememberMe: boolean;
  private imageFileExtension: string;

  public constructor(view: RegisterView) {
    this.view = view;
    this.service = new UserService();
    this.imageBytes = new Uint8Array();
    this.rememberMe = false;
    this.imageFileExtension = "";
  }

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
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );

        this.imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.imageFileExtension = fileExtension;
      }
    } else {
      this.view.setImageUrl("");
      this.imageBytes = new Uint8Array();
    }
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
  ) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        this.imageBytes,
        this.imageFileExtension,
      );

      this.view.updateUserInfo(user, user, authToken, this.rememberMe);
      this.view.navigate(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`,
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }

  public set RememberMe(rememberMe: boolean) {
    this.rememberMe = rememberMe;
  }
}
