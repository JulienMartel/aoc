const { pathname } = new URL(".", import.meta.url);
const text = await Deno.readTextFile(pathname + "/input.txt");
const input = text.split("\n");

/*
--- Day 9: All in a Single Night ---
Every year, Santa manages to deliver all of his presents in a single night.

This year, however, he has some new locations to visit; his elves have provided him the distances between every pair of locations. He can start and end at any two (different) locations he wants, but he must visit each location exactly once. What is the shortest distance he can travel to achieve this?

For example, given the following distances:

London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141
The possible routes are therefore:

Dublin -> London -> Belfast = 982
London -> Dublin -> Belfast = 605
London -> Belfast -> Dublin = 659
Dublin -> Belfast -> London = 659
Belfast -> Dublin -> London = 605
Belfast -> London -> Dublin = 982
The shortest of these is London -> Dublin -> Belfast = 605, and so the answer is 605 in this example.

What is the distance of the shortest route?
*/

// const nodes = input.map((x) => {
//   const [trip, len] = x.split(" = ");
//   const locations = trip.split(" to ");

//   return { locations, len: parseInt(len) };
// });

// console.log(nodes);

// const allLocations = Array.from(
//   new Set(nodes.flatMap((node) => node.locations))
// );

// console.log(allLocations);

// const trips: { from: string; to: string; len: number }[] = [];

// for (let c1 = 0; c1 < allLocations.length; c1++) {
//   for (let c2 = 0; c2 < allLocations.length; c2++) {
//     if (c1 === c2) continue;

//     const from = allLocations[c1];
//     const to = allLocations[c2];
//     console.log(`${from} to ${to}`);

//     // get length of shortest path that visits all nodes

//     const visited = new Set<string>();

//     let totalLen = 0;

//     visited.add(from);

//     while (visited.has(to) === false) {
//       const nexts = nodes.filter((node) => {
//         const [from2, to2] = node.locations;

//         return (
//           node.locations.includes(from) &&
//           !node.locations.includes(to) &&
//           !visited.has(node.locations[0]) &&
//           !visited.has(node.locations[1])
//         );
//       });

//       const next = nexts.sort((a, b) => a.len - b.len)[0];

//       visited.add(next.locations[1]);

//       // totalLen += next.len;
//     }

//     trips.push({ from, to, len: totalLen });
//   }
// }

// Parse input to create a distance map
const distances: Record<string, Record<string, number>> = {};
input.forEach((line) => {
  const parts = line.split(" ");
  const location1 = parts[0];
  const location2 = parts[2];
  const distance = parseInt(parts[4]);

  if (!distances[location1]) distances[location1] = {};
  if (!distances[location2]) distances[location2] = {};

  distances[location1][location2] = distance;
  distances[location2][location1] = distance;
});

// Function to calculate the total distance of a route
function calculateDistance(route: string[]): number {
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += distances[route[i]][route[i + 1]];
  }
  return totalDistance;
}

// Function to generate all permutations of locations
function generatePermutations(locations: string[]): string[][] {
  if (locations.length === 1) return [locations];
  const perms = [];
  for (let i = 0; i < locations.length; i++) {
    const currentLocation = locations[i];
    const remainingLocations = locations
      .slice(0, i)
      .concat(locations.slice(i + 1));
    const remainingPerms = generatePermutations(remainingLocations);
    for (const perm of remainingPerms) {
      perms.push([currentLocation].concat(perm));
    }
  }
  return perms;
}

// Generate permutations of all locations
const locations = Object.keys(distances);
const permutations = generatePermutations(locations);

// Find the shortest route
let shortestDistance = Infinity;
let shortestRoute: string[] | null = null;
permutations.forEach((permutation) => {
  const distance = calculateDistance(permutation);
  if (distance < shortestDistance) {
    shortestDistance = distance;
    shortestRoute = permutation;
  }
});

console.log(
  // @ts-ignore
  `Shortest route: ${shortestRoute.join(" -> ")}\nDistance: ${shortestDistance}`
);
