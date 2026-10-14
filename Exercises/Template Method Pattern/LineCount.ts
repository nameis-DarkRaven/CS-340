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

  protected lines(filePath: string, lines: string[]): number {
    const count = lines.length;
    this.totalLineCount += count;
    return count;
  }

  protected afterFile(count: number, filePath: string): void {
    console.log(`${count} ${filePath}`);
  }

  protected log(): void {
    console.log(`TOTAL: ${this.totalLineCount}`);
  }
}

LineCount.main();
