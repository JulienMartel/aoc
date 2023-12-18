const input = await Deno.readTextFile("./input.txt");

type Direction = "<" | ">" | "v" | "^";
type Coord = [number, number];

const moveOperations: Record<Direction, (lastVisited: Coord) => Coord> = {
  "<": ([lastX, lastY]) => [lastX - 1, lastY],
  ">": ([lastX, lastY]) => [lastX + 1, lastY],
  v: ([lastX, lastY]) => [lastX, lastY - 1],
  "^": ([lastX, lastY]) => [lastX, lastY + 1],
};

/*
--- Day 3: Perfectly Spherical Houses in a Vacuum ---
Santa is delivering presents to an infinite two-dimensional grid of houses.

He begins by delivering a present to the house at his starting location, and then an elf at the North Pole calls him via radio and tells him where to move next. Moves are always exactly one house to the north (^), south (v), east (>), or west (<). After each move, he delivers another present to the house at his new location.

However, the elf back at the north pole has had a little too much eggnog, and so his directions are a little off, and Santa ends up visiting some houses more than once. How many houses receive at least one present?

For example:

> delivers presents to 2 houses: one at the starting location, and one to the east.
^>v< delivers presents to 4 houses in a square, including twice to the house at his starting/ending location.
^v^v^v^v^v delivers a bunch of presents to some very lucky children at only 2 houses.
*/
{
  const visited: Coord[] = [[0, 0]];
  let totalVisited = 1;

  for (let c = 0; c < input.length; c++) {
    const lastVisited = visited.at(-1) as Coord;

    const dir = input[c] as Direction;

    const newLocation = moveOperations[dir](lastVisited);

    const hasVisitedIndex = visited.findLastIndex((visit) => {
      return visit.toString() === newLocation.toString();
    });

    visited.push(newLocation);

    if (hasVisitedIndex === -1) {
      totalVisited++;
    }
  }

  console.log(totalVisited);
}

/*
--- Part Two ---
The next year, to speed up the process, Santa creates a robot version of himself, Robo-Santa, to deliver presents with him.

Santa and Robo-Santa start at the same location (delivering two presents to the same starting house), then take turns moving based on instructions from the elf, who is eggnoggedly reading from the same script as the previous year.

This year, how many houses receive at least one present?

For example:

^v delivers presents to 3 houses, because Santa goes north, and then Robo-Santa goes south.
^>v< now delivers presents to 3 houses, and Santa and Robo-Santa end up back where they started.
^v^v^v^v^v now delivers presents to 11 houses, with Santa going one direction and Robo-Santa going the other.
*/
{
  const santaVisited: Coord[] = [[0, 0]];
  const roboVisited: Coord[] = [[0, 0]];
  let totalVisited = 1;

  for (let c = 0; c < input.length; c++) {
    const visited = c % 2 === 0 ? santaVisited : roboVisited;
    const lastVisited = visited.at(-1) as Coord;

    const dir = input[c] as Direction;
    const newLocation = moveOperations[dir](lastVisited);

    // could replace with for-loop but lazy
    const hasSantaVisitedIndex = santaVisited.findLastIndex((visit) => {
      return visit.toString() === newLocation.toString();
    });
    const hasRoboVisitedIndex = roboVisited.findLastIndex((visit) => {
      return visit.toString() === newLocation.toString();
    });

    visited.push(newLocation);

    if (hasRoboVisitedIndex === -1 && hasSantaVisitedIndex === -1) {
      totalVisited++;
    }
  }

  console.log(totalVisited);
}
