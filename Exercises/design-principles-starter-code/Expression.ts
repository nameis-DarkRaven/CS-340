/* 
1. What design principles does this code violate?
	This function violates the Single Responsibility Principle because it is responsible for determining if a client is
	low risk based on multiple factors (score, income, and authorization). Each should be split into their own check. 
	It also violates the Isolated Change Principles because if we want to change the criteria for determining low risk 
	clients, we would need to modify this function directly. We should only need to refactor the code for that specific criteria.
	Due to the above, this function also violates the High-Quality Abstraction Principle. 
	
2. Refactor the code to improve its design.
	See below.
*/

const EXCELLENT_SCORE = 700;
const GOOD_SCORE = 500;
const MIN_MID_INCOME = 40000;
const MAX_MID_INCOME = 100000;
const HIGH_INCOME = 100000;

function isLowRiskClient(
  score: number,
  income: number,
  authorized: boolean,
): boolean {
  return (
    hasExcellentCredit(score) ||
    isAuthorizedMidIncome(score, income, authorized) ||
    isHighIncome(income)
  );
}

function isAuthorizedMidIncome(
  score: number,
  income: number,
  authorized: boolean,
) {
  return hasGoodCredit(score) && isMidIncome(income) && authorized;
}

function hasExcellentCredit(score: number): boolean {
  return score > EXCELLENT_SCORE;
}

function isMidIncome(income: number): boolean {
  return income >= MIN_MID_INCOME && income <= MAX_MID_INCOME;
}

function hasGoodCredit(score: number) {
  return score > GOOD_SCORE;
}

function isHighIncome(income: number): boolean {
  return income > HIGH_INCOME;
}

/* Originial
function isLowRiskClient0(
  score: number,
  income: number,
  authorized: boolean,
): boolean {
  if (
    !(
      score > 700 ||
      (income >= 40000 && income <= 100000 && authorized && score > 500) ||
      income > 100000
    )
  ) {
    return false;
  } else {
    return true;
  }
}
  */
