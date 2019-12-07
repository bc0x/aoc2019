const parse = require("../dataLoader").parse;

const day2part1 = (data = []) => {
  data[1] = 12;
  data[2] = 2;
  return intCodeComputer(data, calculate);
}

const day2part2 = (data = []) => {
  for(let i = 0; i <= 99; i++){
    for(let j = 0; j <= 99; j++){
      const mutableData = [...data];
      mutableData[1] = i;
      mutableData[2] = j;
      if(intCodeComputer(mutableData, calculate) === 19690720) {
        return 100 * i + j;
      }
    }
  }
}

const intCodeComputer = (data, callback) => {
  let outputData = [...data];
  while(data.length >= 1) {
    const [opCode, inputIdx1, inputIdx2, outputIdx, ...rest] = data;
    if(opCode === 99) break;
    outputData[outputIdx] = callback(opCode, outputData[inputIdx1], outputData[inputIdx2]);
    data = rest;
  }
  return outputData[0];
}

const calculate = (opCode, x, y) => {
  if(opCode === 1) return x + y;
  if(opCode === 2) return x * y;
}

const data = parse(`${__dirname}/data.txt`).split(",").map(Number);
console.log(`Day 1 Part 1 -- ${day2part1(data)}`);
console.log(`Day 1 Part 2 -- ${day2part2(data)}`);
