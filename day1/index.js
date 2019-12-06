const parse = require("../dataLoader").parse;

const day1part1 = (data = []) => {
  return data.reduce((acc, item) => {
    const fuelNeeded = calculateFuel(item);
    return acc + fuelNeeded;
  }, 0);
}

const day1part2 = (data) => {
  return data.reduce((acc, item) => {
    const fuelNeeded = calculateFuel(item, true);
    return acc + fuelNeeded;
  }, 0);
}

const calculateFuel = (fuel, fuelForFuel = false) => {
  const fuelNeeded = Math.floor((fuel / 3)) - 2;
  if (fuelNeeded <= 0) {
    return 0;
  }
  return fuelForFuel ? fuelNeeded + calculateFuel(fuelNeeded, true) : fuelNeeded;
}

const data = parse(`${__dirname}/data.txt`).split("\n").map(Number);
console.log(`Day 1 Part 1 -- ${day1part1(data)}`);
console.log(`Day 1 Part 2 -- ${day1part2(data)}`);
