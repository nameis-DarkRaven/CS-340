import { TemplateMethod } from "./TemplateMethod";

class FileSearch extends TemplateMethod {
  private searchRegExp: RegExp;
  private totalMatches: number = 0;

  public static main(): void {
    let fileSearch: FileSearch;

    if (process.argv.length === 5) {
      fileSearch = new FileSearch(
        process.argv[2],
        process.argv[3],
        process.argv[4],
      );
    }
    if (process.argv.length === 6 && process.argv[2].match("-r")) {
      fileSearch = new FileSearch(
        process.argv[3],
        process.argv[4],
        process.argv[5],
        true,
      );
    } else {
      console.log(
        "USAGE: npx ts-node src/FileSearch.ts {-r} <dir> <file-pattern> <search-pattern>",
      );
      return;
    }

    fileSearch.run();
  }

  constructor(
    dirName: string,
    filePattern: string,
    searchPattern: string,
    recurse: boolean = false,
  ) {
    super(dirName, filePattern, recurse);
    this.searchRegExp = new RegExp(searchPattern);
  }

  protected lines(filePath: string, lines: string[]): number {
    let count = 0;

    lines.forEach((line) => {
      if (this.searchRegExp.test(line)) {
        if (++count == 1) {
          console.log(`\nFILE: ${filePath}`);
        }

        console.log(line);
        this.totalMatches++;
      }
    });
    return count;
  }

  protected afterFile(count: number, filePath: string): void {
    if (count > 0) {
      console.log(`MATCHES: ${count}`);
    }
  }

  protected log(): void {
    console.log(`\nTOTAL MATCHES: ${this.totalMatches}`);
  }
}

FileSearch.main();
