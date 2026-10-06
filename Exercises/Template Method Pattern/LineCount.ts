import * as fs from "fs";
import { TemplateMethod } from "./TemplateMethod";

class LineCount extends TemplateMethod {
  private totalLineCount: number = 0;

  public static main(): void {
    let lineCount: LineCount;

    if (process.argv.length === 4) {
      lineCount = new LineCount(process.argv[2], process.argv[3]);
    } else if (process.argv.length === 5 && process.argv[2].match("-r")) {
      lineCount = new LineCount(process.argv[3], process.argv[4], true);
    } else {
      console.log(
        "USAGE: npx ts-node src/LineCount.ts {-r} <dir> <file-pattern>",
      );
      return;
    }

    lineCount.run();
  }

  constructor(dirName: string, filePattern: string, recurse: boolean = false) {
    super(dirName, filePattern, recurse);
  }

  protected async processFile(filePath: string): Promise<void> {
    if (this.fileRegExp.test(filePath)) {
      let currentLineCount = 0;

      try {
        const fileContent: string = await fs.promises.readFile(
          filePath,
          "utf-8",
        );

        const lines: string[] = fileContent.split(/\r?\n/);
        currentLineCount = lines.length;
        this.totalLineCount += currentLineCount;
      } catch (error) {
        this.unreadableFile(filePath);
      } finally {
        console.log(`${currentLineCount} ${filePath}`);
      }
    }
  }

  protected log(): void {
    console.log(`TOTAL: ${this.totalLineCount}`);
  }
}

LineCount.main();
