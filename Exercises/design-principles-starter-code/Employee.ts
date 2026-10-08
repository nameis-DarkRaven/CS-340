
/*1. Explain how this program violates the High-Quality Abstraction principle.
  As it is, Employee is just a data structure that holds two dates, and all of the logic related to calculating years
  of service and months in last position is in RetirementCalculator. If we wanted to use these concepts 
  in another context (for example, if we wanted to calculate an employee's total years of service for a performance 
  review), we would have to duplicate the logic from RetirementCalculator, which violates the High-Quality Abstraction 
  principle.
  In addition, the variables in Employee are public, which means that any code can modify them directly, which violates
  both the High-Quality Abstraction principle and the Encapsulation principle. 

2. Explain how you would refactor the code to improve its design.
  I would move the logic for calculating years of service and months in last position into the Employee class and
  change Employee's variables to private and add getters for them. In this case, specifically, employmentEndDate
  should likely be set to null to begin with, and a setter method should be added to set it when the employee retires.	
  The employmentStartDate may only need a setter for when mistakes happen, like if the original start date was entered
  incorrectly. If there is no risk of this, then the employmentStartDate should be set in the constructor and not have 
  a setter at all, since it should never change after the employee is hired. 

*/
class Employee {
	public employmentStartDate: Date;
	public employmentEndDate: Date;
}

class RetirementCalculator {
	private employee: Employee;

	public constructor(emp: Employee) {
		this.employee = emp;
	}

	public calculateRetirement(payPeriodStart: Date, payPeriodEnd: Date): number { … }

	private getTotalYearsOfService(startDate: Date, endDate: Date): number { … }

	private getMonthsInLastPosition(startDate: Date, endDate: Date): number { … }
	
    ...
}
