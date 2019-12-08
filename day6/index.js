const parse = require('../dataLoader').parse;

const day6part1 = (data = []) => {
  return Object.keys(data).reduce((acc, planet) => {
    return acc + countOrbits(planet, data);
  }, 0);
};

const day6part2 = (data = []) => {
  const map = Object.entries(data).reduce((acc, [k, v]) => {
    acc[k] = acc[k] || [];
    acc[v] = acc[v] || [];
    acc[k].push(v);
    acc[v].push(k);
    return acc;
  }, {});
  console.log(map);
};

// If the planet exist in the data it orbits another planet. Add 1 and
// check if the other planet then orbits another.
const countOrbits = (planet, data) =>
  !data[planet] ? 0 : countOrbits(data[planet], data) + 1;

const data = parse(`${__dirname}/test.txt`)
  .split('\n')
  .map(String)
  .reduce((acc, i) => {
    const [parentPlanent, orbittingPlanet] = i.split(')');
    // switch order
    acc[orbittingPlanet] = parentPlanent;
    return acc;
  }, {});

console.log(`Day 1 Part 1 -- ${day6part1(data)}`);
console.log(`Day 1 Part 2 -- ${day6part2(data)}`);
