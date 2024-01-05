const text = await Deno.readTextFile("./input.txt");
const input = text.split("\n");

// pt 1

let final = 0;

input.forEach((line) => {
  const [l, w, h] = line.split("x").map((x) => parseInt(x));

  const total = 2 * l * w + 2 * w * h + 2 * h * l;

  final += total + Math.min(l * w, w * h, h * l);
});

console.log(final);

// pt 2

let ribonFinal = 0;

input.forEach((line) => {
  const [l, w, h] = line.split("x").map((x) => parseInt(x));

  const smallestTwoSides = [l, w, h].sort((a, b) => a - b).slice(0, 2);
  const perimTotal = smallestTwoSides[0] * 2 + smallestTwoSides[1] * 2;

  ribonFinal += perimTotal + l * w * h;
});

console.log(ribonFinal);
