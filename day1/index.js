const parse = require("../dataLoader").parse;

const day1part1 = (data = []) => {
  data = data.split("\n").map(Number);
  return data.reduce((acc, item) => {
    const fuelNeeded = calculateFuel(item);
    return fuelNeeded > 0 ? acc + fuelNeeded : acc;
  }, 0);
}

const day1part2 = (data) => {
  data = data.split("\n").map(Number);
  return data.reduce((acc, item) => {
    const fuelNeeded = calculateFuel(item, true);
    return fuelNeeded > 0 ? acc + fuelNeeded : acc;
  }, 0);
}

const calculateFuel = (fuel, fuelForFuel = false) => {
  if ((Math.floor((fuel / 3)) - 2) <= 0) {
    return 0;
  }
  const fuelNeeded = Math.floor((fuel / 3)) - 2;
  return fuelForFuel ? fuelNeeded + calculateFuel(fuelNeeded, true) : fuelNeeded;
}

const data = parse(`${__dirname}/data.txt`);
console.log(`Day 1 Part 1 -- ${day1part1(data)}`);
console.log(`Day 1 Part 2 -- ${day1part2(data)}`);
