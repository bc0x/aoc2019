const parse = require('../dataLoader').parse;

const day4 = (data = [], exact = false) => {
  const passwords = [...Array(data[1] - data[0]).keys()].map(i => i + data[0]);
  const sortedPasswords = passwords.filter(pw => pw === sortDigits(pw));
  const repeatingSortedPassword = sortedPasswords.filter(pw => {
    const numbers = [...String(pw)];
    for (d of numbers) {
      let count = numbers.reduce((c, n) => c + (n === d), 0);
      if (exact) {
        if (count === 2) {
          return true;
        }
      } else {
        if (count >= 2) {
          return true;
        }
      }
    }
    return false;
  });
  return repeatingSortedPassword.length;
};

const sortDigits = number =>
  Number([...String(number)].sort((a, b) => a - b).join(''));

const data = parse(`${__dirname}/data.txt`)
  .split('-')
  .map(Number);
console.log(`Day 4 Part 1 -- ${day4(data)}`);
console.log(`Day 4 Part 2 -- ${day4(data, true)}`);
