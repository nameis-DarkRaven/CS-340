/* 
1. Explain why/how this program violates the Single Responsibility Principle
	The CsvWriter class is responsible for both formatting CSV data and writing it to the console. This violates the 
  Single Responsibility Principle because a class should have only one reason to change. In this case, changes to the
  CSV formatting rules or the output method would both require changes to this class.


2. Explain how you would refactor the program to improve its design.
	I would refactor the program by creating two separate classes: CsvFormatter and ConsoleWriter. The CsvFormatter class
  would be responsible for formatting the CSV data according to the rules (e.g., handling commas and quotes), while the
  ConsoleWriter class would be responsible for writing the formatted data to the console. This separation of concerns
  allows each class to have a single responsibility, making the code easier to maintain and modify in the future.	I 
  would also consider reconfiguring the CsvFormatter to return a string instead of writing directly to the console, 
	allowing for more flexibility in how the formatted data is used. Then, the CsvWriter can output the string to the 
  console or to a file, depending on the requirements, potentially with the ability to do both based on arguments/a 
  boolean, etc.

*/
export class CsvWriter {
  public write(lines: string[][]) {
    for (let i = 0; i < lines.length; i++) this.writeLine(lines[i]);
  }

  private writeLine(fields: string[]) {
    if (fields.length == 0) console.log();
    else {
      this.writeField(fields[0]);

      for (let i = 1; i < fields.length; i++) {
        console.log(",");
        this.writeField(fields[i]);
      }
      console.log();
    }
  }

  private writeField(field: string) {
    if (field.indexOf(",") != -1 || field.indexOf('\"') != -1)
      this.writeQuoted(field);
    else console.log(field);
  }

  private writeQuoted(field: string) {
    console.log('\"');
    for (let i = 0; i < field.length; i++) {
      let c: string = field.charAt(i);
      if (c == '\"') console.log('""');
      else console.log(c);
    }
    console.log('\"');
  }
}
