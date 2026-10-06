import * as fs from "fs";
import * as path from "path";

export abstract class TemplateMethod {
  protected dirName: string;
  protected fileRegExp: RegExp;
  protected recurse: boolean;

  public static main(): void {}

  public constructor(
    dirName: string,
    filePattern: string,
    recurse: boolean = false,
  ) {
    this.dirName = dirName;
    this.fileRegExp = new RegExp(filePattern);
    this.recurse = recurse;
  }

  protected async run() {
    await this.processDirectory(this.dirName);
    this.log();
  }

  private async processDirectory(filePath: string) {
    if (!this.isDirectory(filePath)) {
      this.nonDirectory(filePath);
      return;
    }
    if (!this.isReadable(filePath)) {
      this.unreadableDirectory(filePath);
      return;
    }
    const files = fs.readdirSync(filePath);

    for (let file of files) {
      const fullPath = path.join(filePath, file);
      if (this.isFile(fullPath)) {
        if (this.isReadable(fullPath)) {
          await this.processFile(fullPath);
        } else {
          this.unreadableFile(fullPath);
        }
      }
    }

    if (this.recurse) {
      for (let file of files) {
        const fullPath = path.join(filePath, file);
        if (this.isDirectory(fullPath)) {
          await this.processDirectory(fullPath);
        }
      }
    }
  }

  protected async processFile(filePath: string) {}

  protected log(): void {}

  private isDirectory(path: string): boolean {
    try {
      return fs.statSync(path).isDirectory();
    } catch (error) {
      return false;
    }
  }

  private isFile(path: string): boolean {
    try {
      return fs.statSync(path).isFile();
    } catch (error) {
      return false;
    }
  }

  private isReadable(path: string): boolean {
    try {
      fs.accessSync(path, fs.constants.R_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  protected nonDirectory(dirName: string): void {
    console.log(`${dirName} is not a directory`);
  }

  protected unreadableDirectory(dirName: string): void {
    console.log(`Directory ${dirName} is unreadable`);
  }

  protected unreadableFile(fileName: string): void {
    console.log(`File ${fileName} is unreadable`);
  }
}
