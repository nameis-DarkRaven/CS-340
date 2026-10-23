import { Buffer } from "buffer";
import { ChangeEvent } from "react";
import { UserService } from "../model.service/UserService";
import { AuthPresenter, AuthView, RegistrationFormData } from "./AuthPresenter";

export interface RegisterView extends AuthView {
  setImageUrl: (imageUrl: string) => void;
}

export class RegisterPresenter extends AuthPresenter<RegisterView> {
  private service: UserService = new UserService();
  private imageBytes: Uint8Array = new Uint8Array();
  private imageFileExtension: string = "";

  public checkSubmitButtonStatus(formData: RegistrationFormData): boolean {
    return (
      !formData.firstName ||
      !formData.lastName ||
      !formData.alias ||
      !formData.password ||
      !formData.imageUrl ||
      !this.imageFileExtension
    );
  }

  public registerOnEnter(
    event: React.KeyboardEvent<HTMLElement>,
    formData: RegistrationFormData,
  ) {
    this.doOperationOnEnter(
      event,
      () => this.doRegister(formData),
      () => this.checkSubmitButtonStatus(formData),
    );
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

  public async doRegister(formData: RegistrationFormData) {
    this.handleAuthOperation(
      () =>
        this.service.register(
          formData.firstName,
          formData.lastName,
          formData.alias,
          formData.password,
          this.imageBytes,
          this.imageFileExtension,
        ),
      "register user",
      (user) => `/feed/${user.alias}`,
    );
  }
}
