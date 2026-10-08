/* 1. What design principle(s) does this code violate?
	The Course class violates the Single Responsibility Principle and High-Quality Abstraction principle because it is 
	responsible for both representing a	course and handling database operations, and because it is not closed for 
	modification due to the fact that if the database changes, the Course class would need to be modified. This class 
	also violates the Information Hiding principle because it exposes its internal data and (potentially--it's not implemented
  	yet) its database operations directly, which can lead to unintended consequences and makes it harder to maintain and 
  	evolve the class in the future.
*/
/* 2. Explain how you would refactor this code to improve its design.
	I would create a separate class or module responsible for database operations, such as CourseService, and keep the
	Course class focused solely on representing a course. This way, only the CourseService class would be responsible
	for interacting with the database (meaning that if the database changes, only the CourseService class needs to be 
	updated), while the Course class would only contain properties and methods related to the course itself. This 
	separation of concerns would make the code more maintainable and easier to understand.

*/
export class Course {
  name: string;
  credits: number;

  constructor(name: string, credits: number) {
    this.name = name;
    this.credits = credits;
  }

  static async create(name: string, credits: number): Promise<Course> {
    // ... Code to insert a new Course object into the database ...
  }

  static async find(name: string): Promise<Course | undefined> {
    // ... Code to find a Course object in the database ...
  }

  async update(): Promise<void> {
    // ... Code to update a Course object in the database ...
  }
}
