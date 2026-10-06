import { Animal } from "./abstract/Animal";

export class Cat extends Animal {
  purrs: boolean;
  climbsFurniture: boolean;

  constructor(
    name: string,
    trainingPriority: number,
    purrs: boolean,
    climbsFurniture: boolean,
  ) {
    super(name, trainingPriority);
    this.purrs = purrs;
    this.climbsFurniture = climbsFurniture;
  }

  easiestAnimalString(easiestCat: Cat): string {
    return (
      easiestCat.name +
      " needs the least training" +
      (easiestCat.purrs
        ? ", and purrs a lot."
        : ", although it rarely purrs.") +
      (easiestCat.climbsFurniture
        ? " It unfortunately climbs furniture a lot, leaving scratches."
        : " It fortunately does not climb furniture.")
    );
  }

  mostDifficultAnimalString(mostDifficultCat: Cat): string {
    return (
      mostDifficultCat.name +
      " needs the most training." +
      (mostDifficultCat.purrs
        ? " It is grumpy and rarely purrs."
        : " It is friendly and purrs a lot") +
      (mostDifficultCat.climbsFurniture
        ? " It unfortunately climbs furniture a lot, leaving scratches."
        : " It fortunately does not climb furniture.")
    );
  }
}
