/* 
1. What is the biggest design principle violation in the code below.
	This code heavily violates the DRY Principle, Don't Repeat Yourself, or Avoid Code Duplication. A few functions
	can be created to replace most of this code and improve its quality and readability.

2. Refactor the code to improve its design.
	See below:
*/

type Dictionary = {
  [index: string]: string;
};

type Times = {
  interval: number;
  duration: number;
  departure: number;
};

function getTimes(props: Dictionary): Times {
  const interval = parsePositiveInt(props, "interval");
  const duration = parsePositiveInt(props, "duration");
  const departure = parsePositiveInt(props, "departure");

  validate(duration, interval, "duration");
  validate(departure, interval, "departure");

  return { interval, duration, departure };
}

function validate(value: number, interval: number, name: string): void {
  if (value % interval !== 0) {
    throw new Error(`${name} % interval != 0`);
  }
}

function parsePositiveInt(props: Dictionary, key: string): number {
  const valueString = props[key];
  if (!valueString) {
    throw new Error(`missing ${key}`);
  }

  const value = parseInt(valueString);
  if (value <= 0) {
    throw new Error(`${key} must be > 0`);
  }

  return value;
}

/* Original Code:
type Dictionary = {
  [index: string]: string;
};

type Times = {
  interval: number;
  duration: number;
  departure: number;
};

function getTimes(props: Dictionary): Times {
  let valueString: string;
  let value: number;

  valueString = props["interval"];
  if (!valueString) {
    throw new Error("missing interval");
  }
  value = parseInt(valueString);
  if (value <= 0) {
    throw new Error("interval must be > 0");
  }
  let interval = value;

  valueString = props["duration"];
  if (!valueString) {
    throw new Error("missing duration");
  }
  value = parseInt(valueString);
  if (value <= 0) {
    throw new Error("duration must be > 0");
  }
  if (value % interval != 0) {
    throw new Error("duration % interval != 0");
  }
  let duration = value;

  valueString = props["departure"];
  if (!valueString) {
    throw new Error("missing departure");
  }
  value = parseInt(valueString);
  if (value <= 0) {
    throw new Error("departure must be > 0");
  }
  if (value % interval != 0) {
    throw new Error("departure % interval != 0");
  }
  let departure = value;

  return { interval, duration, departure };
}
*/
