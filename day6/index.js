const parse = require('../dataLoader').parse;

const day6part1 = (data = []) => {
  return Object.keys(data).reduce((acc, planet) => {
    return acc + countOrbits(planet, data);
  }, 0);
};

// If the planet exist in the data it orbits another planet. Add 1 and
// check if the orbited planet then orbits another and so on.
const countOrbits = (planet, data) =>
  !data[planet] ? 0 : countOrbits(data[planet], data) + 1;

const day6part2 = (data = []) => {
  const map = Object.entries(data).reduce((acc, [k, v]) => {
    acc[k] = acc[k] || [];
    acc[v] = acc[v] || [];
    acc[k].push(v);
    acc[v].push(k);
    return acc;
  }, {});
  const distances = getDistances(map, 'YOU');
  return distances.get('SAN') - 2;
};

const getDistances = (orbits, from) => {
  // unique keys
  const nodes = new Set(Object.keys(orbits));
  const dist = new Map();

  // init map - set starting location
  [...nodes].forEach(node => dist.set(node, Infinity));
  dist.set(from, 0);

  while (nodes.size) {
    // get the closest node left.
    const closest = [...nodes].reduce((acc, n) => {
      return dist.get(n) < dist.get(acc) ? n : acc;
    });
    // decrement
    nodes.delete(closest);
    // loop each neighbor to the closest
    orbits[closest].forEach(neighbor => {
      //get distance for the close and add 1 to neighbor
      const newDistance = dist.get(closest) + 1;
      const prevDistance = dist.get(neighbor);
      // check if there is a shorter path already set
      if (newDistance < prevDistance) {
        dist.set(neighbor, newDistance);
      }
    });
  }
  return dist;
};

const data = parse(`${__dirname}/data.txt`)
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
