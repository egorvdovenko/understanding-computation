import {
  type SEnvironment,
  type SExpression,
  SNumber, SAdd, SMultiply, SLessThan, SVariable, SMachine
} from "./Part1ProgramsAndMachines/2TheMeaningOfPrograms/SmallStepSemantics";

const environment: SEnvironment = {
  x: new SNumber(5),
  y: new SNumber(10),
};

const numericExpression: SExpression = new SAdd(
  new SMultiply(new SNumber(2), new SNumber(2)),
  new SMultiply(new SNumber(8), new SNumber(8))
);

const booleanExpression: SExpression = new SLessThan(
  new SMultiply(new SNumber(2), new SNumber(2)),
  new SMultiply(new SNumber(8), new SNumber(8))
);

const variableExpression: SExpression = new SAdd(
  new SVariable("x"),
  new SVariable("y"),
);

function runMachine(expression: SExpression, environment: SEnvironment) {
  const machine = new SMachine(expression, environment);
  machine.run();
}

runMachine(numericExpression, environment);
runMachine(booleanExpression, environment);
runMachine(variableExpression, environment);