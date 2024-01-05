const { pathname } = new URL(".", import.meta.url);
const text = await Deno.readTextFile(pathname + "/input.txt");
const input = text.split("\n");

type Op = "off" | "on" | "toggle";
const directives = input
  .map((i) => i.replaceAll("turn ", "").split(" through "))
  .map((i) => {
    const firstPart = i[0].split(" ");

    return {
      op: firstPart[0] as Op,
      from: [
        Number(firstPart[1].split(",")[0]),
        Number(firstPart[1].split(",")[1]),
      ],
      to: [Number(i[1].split(",")[0]), Number(i[1].split(",")[1])],
    };
  });

/*
--- Day 6: Probably a Fire Hazard ---
Because your neighbors keep defeating you in the holiday house decorating contest year after year, you've decided to deploy one million lights in a 1000x1000 grid.

Furthermore, because you've been especially nice this year, Santa has mailed you instructions on how to display the ideal lighting configuration.

Lights in your grid are numbered from 0 to 999 in each direction; the lights at each corner are at 0,0, 0,999, 999,999, and 999,0. The instructions include whether to turn on, turn off, or toggle various inclusive ranges given as coordinate pairs. Each coordinate pair represents opposite corners of a rectangle, inclusive; a coordinate pair like 0,0 through 2,2 therefore refers to 9 lights in a 3x3 square. The lights all start turned off.

To defeat your neighbors this year, all you have to do is set up your lights by doing the instructions Santa sent you in order.

For example:

turn on 0,0 through 999,999 would turn on (or leave on) every light.
toggle 0,0 through 999,0 would toggle the first line of 1000 lights, turning off the ones that were on, and turning on the ones that were off.
turn off 499,499 through 500,500 would turn off (or leave off) the middle four lights.
After following the instructions, how many lights are lit?
*/

{
  const grid: boolean[][] = new Array(1000)
    .fill(null)
    .map(() => new Array(1000).fill(false));

  const operateOnGrid = (x: number, y: number, op: Op) => {
    if (op === "on") grid[x][y] = true;
    else if (op === "off") grid[x][y] = false;
    else if (op === "toggle") grid[x][y] = !grid[x][y];
  };

  directives.forEach((dir) => {
    const { from, to, op } = dir;

    for (let x = from[0]; x <= to[0]; x++) {
      for (let y = from[1]; y <= to[1]; y++) {
        operateOnGrid(x, y, op);
      }
    }
  });

  console.log(grid.flat().filter(Boolean).length);
}

/*
--- Part Two ---
You just finish implementing your winning light pattern when you realize you mistranslated Santa's message from Ancient Nordic Elvish.

The light grid you bought actually has individual brightness controls; each light can have a brightness of zero or more. The lights all start at zero.

The phrase turn on actually means that you should increase the brightness of those lights by 1.

The phrase turn off actually means that you should decrease the brightness of those lights by 1, to a minimum of zero.

The phrase toggle actually means that you should increase the brightness of those lights by 2.

What is the total brightness of all lights combined after following Santa's instructions?

For example:

turn on 0,0 through 0,0 would increase the total brightness by 1.
toggle 0,0 through 999,999 would increase the total brightness by 2000000.
*/

{
  const grid: number[][] = new Array(1000)
    .fill(null)
    .map(() => new Array(1000).fill(0));

  const operateOnGrid = (x: number, y: number, op: Op) => {
    if (op === "on") grid[x][y]++;
    else if (op === "off" && grid[x][y] > 0) grid[x][y]--;
    else if (op === "toggle") grid[x][y] += 2;
  };

  directives.forEach((dir) => {
    const { from, to, op } = dir;

    for (let x = from[0]; x <= to[0]; x++) {
      for (let y = from[1]; y <= to[1]; y++) {
        operateOnGrid(x, y, op);
      }
    }
  });

  console.log(grid.flat().reduce((acc, next) => acc + next));
}
