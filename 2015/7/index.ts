const { pathname } = new URL(".", import.meta.url);
const text = await Deno.readTextFile(pathname + "/input.txt");
const input = text.split("\n");
/*
--- Day 7: Some Assembly Required ---
This year, Santa brought little Bobby Tables a set of wires and bitwise logic gates! Unfortunately, little Bobby is a little under the recommended age range, and he needs help assembling the circuit.

Each wire has an identifier (some lowercase letters) and can carry a 16-bit signal (a number from 0 to 65535). A signal is provided to each wire by a gate, another wire, or some specific value. Each wire can only get a signal from one source, but can provide its signal to multiple destinations. A gate provides no signal until all of its inputs have a signal.

The included instructions booklet describes how to connect the parts together: x AND y -> z means to connect wires x and y to an AND gate, and then connect its output to wire z.

For example:

123 -> x means that the signal 123 is provided to wire x.
x AND y -> z means that the bitwise AND of wire x and wire y is provided to wire z.
p LSHIFT 2 -> q means that the value from wire p is left-shifted by 2 and then provided to wire q.
NOT e -> f means that the bitwise complement of the value from wire e is provided to wire f.
Other possible gates include OR (bitwise OR) and RSHIFT (right-shift). If, for some reason, you'd like to emulate the circuit instead, almost all programming languages (for example, C, JavaScript, or Python) provide operators for these gates.

For example, here is a simple circuit:

123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i
After it is run, these are the signals on the wires:

d: 72
e: 507
f: 492
g: 114
h: 65412
i: 65079
x: 123
y: 456
In little Bobby's kit's instructions booklet (provided as your puzzle input), what signal is ultimately provided to wire a?
*/

const numberRegex = new RegExp(/^\d+$/);
function isNumber(str: string) {
  return numberRegex.test(str);
}

// serialize the list
const parsed = input.map((x) => {
  const splitStr = x.split(" -> ");
  return {
    key: splitStr[1],
    value: undefined as undefined | number,
    expression: splitStr[0],
  };
});

function getBothSides(a: string, c: string) {
  const left = isNumber(a)
    ? parseInt(a)
    : parsed.find((x) => x.key === a)?.value;
  const right = isNumber(c)
    ? parseInt(c)
    : parsed.find((x) => x.key === c)?.value;

  return [left, right];
}

// this solution assumes that each wire signal is needed to solve "a".
// if they're not all needed, recursion would be a better solution:

// loop through until each item is resolved
while (parsed.some((p) => p.value === undefined)) {
  for (let count = 0; count < parsed.length; count++) {
    // skip keys that are already solved
    const item = parsed[count];
    if (item.value !== undefined) {
      continue;
    }

    // for when the operation is simply a number
    if (isNumber(item.expression)) {
      item.value = parseInt(item.expression);
      continue;
    }

    const [a, b, c] = item.expression.split(" ");

    // for when the opration is simply another key
    const expressionVal = isNumber(a)
      ? parseInt(a)
      : parsed.find((x) => x.key === a)?.value;
    if (b === undefined && c === undefined && expressionVal) {
      const alreadyHasValue = parsed.find((x) => x.key === item.expression);

      if (alreadyHasValue) {
        item.value = expressionVal;
        continue;
      }
    }

    // handle the bitwise operations (could make a HOF to make this less repetative)

    // NOT
    const notExpressionVal = isNumber(b)
      ? parseInt(b)
      : parsed.find((x) => x.key === b)?.value;
    if (a === "NOT" && notExpressionVal !== undefined) {
      item.value = ~notExpressionVal;
      continue;
    }

    const [left, right] = getBothSides(a, c);
    if (left === undefined || right === undefined) {
      // for narrowing (or if any "unconnected" wires)
      continue;
    }

    switch (b) {
      case "AND":
        item.value = left & right;
        break;
      case "OR":
        item.value = left | right;
        break;
      case "LSHIFT":
        item.value = left << right;
        break;
      case "RSHIFT":
        item.value = left >> right;
        break;
    }
  }
}

console.log(parsed.find((x) => x.key === "a")?.value);
