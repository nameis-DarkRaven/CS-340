export abstract class Animal {
  name: string;
  trainingPriority: number;

  constructor(name: string, trainingPriority: number) {
    this.trainingPriority = trainingPriority;
    this.name = name;
  }

  static getSorted<T extends Animal>(animalList: T[]): T[] {
    return animalList.sort((animal1, animal2) =>
      animal1.trainingPriority < animal2.trainingPriority ? -1 : 1,
    );
  }

  static getTrainingPriorityList<T extends Animal>(animalList: T[]): string {
    return animalList
      .map(
        (animal) =>
          animal.name +
          "'s training priority: " +
          animal.trainingPriority +
          "\n",
      )
      .join("");
  }

  /* Not required, but there was still duplicate code. */
  static getAnimalSummary<T extends Animal>(animalListNotSorted: T[]): string {
    let animalList = Animal.getSorted(animalListNotSorted);
    let easiestAnimal = animalList[0];
    let mostDifficultAnimal = animalList[animalList.length - 1];

    let easiestAnimalString = easiestAnimal.easiestAnimalString(easiestAnimal);
    let mostDifficultAnimalString =
      mostDifficultAnimal.mostDifficultAnimalString(mostDifficultAnimal);

    let animalTrainingPriorities = this.getTrainingPriorityList(animalList);
    return (
      animalTrainingPriorities +
      "\n" +
      easiestAnimalString +
      "\n" +
      mostDifficultAnimalString
    );
  }

  easiestAnimalString(easiestAnimal: Animal): string {
    return "";
  }
  mostDifficultAnimalString(mostDifficultAnimal: Animal): string {
    return "";
  }
}
