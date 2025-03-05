import {
  type SEnvironment,
  type SExpression,
  type SStatement,
  SNumber, 
  SAdd, 
  SMultiply, 
  SLessThan, 
  SVariable, 
  SAssign, 
  SIf,
  SSequence,
  SExpressionMachine, 
  SStatementMachine,
} from "./Part1ProgramsAndMachines/2TheMeaningOfPrograms/SmallStepSemantics";

const environment: SEnvironment = {
  x: new SNumber(5),
  y: new SNumber(10),
};

console.group("Part 1: Programs and Machines => 2. The Meaning of Programs => Small-Step Semantics");
console.group("Expressions");

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

function runExpressionMachine(expression: SExpression, environment: SEnvironment) {
  const machine = new SExpressionMachine(expression, environment);
  machine.run();
}

runExpressionMachine(numericExpression, environment);
runExpressionMachine(booleanExpression, environment);
runExpressionMachine(variableExpression, environment);

console.groupEnd();
console.group("Statements");

const assignStatement: SStatement = new SAssign("z", new SAdd(new SVariable("x"), new SVariable("y")));

const ifStatement: SStatement = new SIf(
  new SLessThan(new SVariable("x"), new SVariable("y")),
  new SAssign("z", new SAdd(new SVariable("x"), new SVariable("y"))),
  new SAssign("z", new SAdd(new SVariable("y"), new SVariable("x"))),
);

const sequenceStatement: SStatement = new SSequence(
  new SAssign("z", new SAdd(new SVariable("x"), new SVariable("y"))),
  new SAssign("z", new SAdd(new SVariable("z"), new SVariable("z"))),
);

function runStatementMachine(statement: SStatement, environment: SEnvironment) {
  const machine = new SStatementMachine(statement, environment);
  machine.run();
}

runStatementMachine(assignStatement, environment);
runStatementMachine(ifStatement, environment);
runStatementMachine(sequenceStatement, environment);

console.groupEnd();
console.groupEnd();

