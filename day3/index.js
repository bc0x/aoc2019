const parse = require('../dataLoader').parse;

const day3part1 = (data = []) => {
  let [wire1, wire2] = data;
  wire1 = wire1.split(',');
  wire2 = wire2.split(',');
  const t1 = drawWire(wire1);
  const t2 = drawWire(wire2);
  const intersections = getIntersections(t1, t2);
  const distances = intersections.map(i => {
    const [x, y] = i.split(',');
    return Math.abs(x) + Math.abs(y);
  });
  return Math.min(...distances);
};

const day3part2 = (data = []) => {
  let [wire1, wire2] = data;
  wire1 = wire1.split(',');
  wire2 = wire2.split(',');
  const t1 = drawWire(wire1);
  const t2 = drawWire(wire2);
  const intersections = getIntersections(t1, t2);
  const steps = intersections.map(i => {
    return t1[i] + t2[i];
  });
  return Math.min(...steps);
};

const getIntersections = (wire1, wire2) => {
  return Object.keys(wire1).filter(k => k in wire2);
};

const drawWire = wireRoutes => {
  const circuit = {};
  let x = (y = steps = 0);
  for (const route of wireRoutes) {
    let [direction, ...distance] = route;
    let moveX = (moveY = 0);
    distance = Number(distance.join(''));
    if (direction === 'U') moveY = 1;
    if (direction === 'D') moveY = -1;
    if (direction === 'L') moveX = -1;
    if (direction === 'R') moveX = 1;

    for (let i = 1; i <= distance; i++) {
      x += moveX;
      y += moveY;
      steps += 1;
      if (!(`${x},${y}` in circuit)) {
        circuit[`${x},${y}`] = steps;
      }
    }
  }
  return circuit;
};

const data = parse(`${__dirname}/data.txt`).split('\n');
console.log(`Day 3 Part 1 -- ${day3part1(data)}`);
console.log(`Day 3 Part 2 -- ${day3part2(data)}`);
