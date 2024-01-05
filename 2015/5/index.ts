const text = await Deno.readTextFile("./input.txt");
const input = text.split("\n");

/*
--- Day 5: Doesn't He Have Intern-Elves For This? ---
Santa needs help figuring out which strings in his text file are naughty or nice.

A nice string is one with all of the following properties:

It contains at least three vowels (aeiou only), like aei, xazegov, or aeiouaeiouaeiou.
It contains at least one letter that appears twice in a row, like xx, abcdde (dd), or aabbccdd (aa, bb, cc, or dd).
It does not contain the strings ab, cd, pq, or xy, even if they are part of one of the other requirements.
For example:

ugknbfddgicrmopn is nice because it has at least three vowels (u...i...o...), a double letter (...dd...), and none of the disallowed substrings.
aaa is nice because it has at least three vowels and a double letter, even though the letters used by different rules overlap.
jchzalrnumimnmhp is naughty because it has no double letter.
haegwjzuvuyypxyu is naughty because it contains the string xy.
dvszwmarrgswjxmb is naughty because it contains only one vowel.
How many strings are nice?
*/

{
  const mustContain = ["a", "e", "i", "o", "u"];
  const cannotContain = ["ab", "cd", "pq", "xy"];

  let total = 0;

  input.forEach((str) => {
    let firstQuali = false;
    let vowelCount = 0;
    for (let c = 0; c < str.length; c++) {
      if (mustContain.includes(str[c])) {
        vowelCount++;

        if (vowelCount > 2) {
          firstQuali = true;
          continue;
        }
      }
    }

    let secondQuali = false;
    for (let c = 0; c < str.length; c++) {
      if (c !== 0) {
        if (str[c] === str[c - 1]) {
          secondQuali = true;
          continue;
        }
      }
    }

    let thirdQuali = true;
    for (let c = 0; c < str.length; c++) {
      if (c !== 0) {
        if (cannotContain.includes(`${str[c - 1]}${str[c]}`)) {
          thirdQuali = false;
          continue;
        }
      }
    }

    if (firstQuali && secondQuali && thirdQuali) {
      total++;
    }
  });

  console.log(total);
}

/*
--- Part Two ---
Realizing the error of his ways, Santa has switched to a better model of determining whether a string is naughty or nice. None of the old rules apply, as they are all clearly ridiculous.

Now, a nice string is one with all of the following properties:

It contains a pair of any two letters that appears at least twice in the string without overlapping, like xyxy (xy) or aabcdefgaa (aa), but not like aaa (aa, but it overlaps).
It contains at least one letter which repeats with exactly one letter between them, like xyx, abcdefeghi (efe), or even aaa.
For example:

qjhvhtzxzqqjkmpb is nice because is has a pair that appears twice (qj) and a letter that repeats with exactly one letter between them (zxz).
xxyxx is nice because it has a pair that appears twice and a letter that repeats with one between, even though the letters used by each rule overlap.
uurcxstgmygtbstg is naughty because it has a pair (tg) but no repeat with a single letter between them.
ieodomkazucvgmuy is naughty because it has a repeating letter with one between (odo), but no pair that appears twice.
How many strings are nice under these new rules?
*/

{
  let total = 0;

  input.forEach((str) => {
    let firstQuali = false;
    const pairs: string[] = [];

    for (let c = 0; c < str.length; c++) {
      if (c !== 0) {
        if (
          pairs.includes(`${str[c - 1]}${str[c]}`) &&
          pairs.indexOf(`${str[c - 1]}${str[c]}`) !== pairs.length - 1
        ) {
          firstQuali = true;
          continue;
        }
        pairs.push(`${str[c - 1]}${str[c]}`);
      }
    }

    let secondQuali = false;
    for (let c = 0; c < str.length; c++) {
      if (c >= 2) {
        if (str[c - 2] === str[c]) {
          secondQuali = true;
          continue;
        }
      }
    }

    if (firstQuali && secondQuali) {
      total++;
    }
  });

  console.log(total);
}
