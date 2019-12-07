const parse = require('../dataLoader').parse;

const day5part1 = async (data = []) => {
  return await intCodeComputer(data);
};

const day5part2 = async (data = []) => {
  return await intCodeComputer(data);
};

const intCodeComputer = async data => {
  let outputData = [...data];
  let pointer = outputData.length - data.length;
  let jump = false;
  let diagnosticCode = 0;
  while (data.length >= 1) {
    let [_, ...rest] = data; // pull off opCode
    let code = outputData[pointer]; // get opCode from the mutated data
    let { opCode, param1, param2, param3 } = getInstruction(code); // get instruction from code
    data = rest; // reset data after pulling off args
    if ([1, 2, 7, 8].includes(opCode)) {
      let [inputIdx1, inputIdx2, outputIdx, ...rest] = data;
      data = rest; // reset data after pulling off args
      outputData[outputIdx] = calculate(
        opCode,
        param1 ? inputIdx1 : outputData[inputIdx1],
        param2 ? inputIdx2 : outputData[inputIdx2]
      );
    } else if (opCode === 3) {
      let [outputIdx, ...rest] = data;
      data = rest; // reset data after pulling off args
      let input = Number(await getInput());
      outputData[outputIdx] = input;
    } else if (opCode === 4) {
      let [outputIdx, ...rest] = data;
      data = rest; // reset data after pulling off args
      diagnosticCode = param1 ? outputIdx : outputData[outputIdx];
    } else if ([5, 6].includes(opCode)) {
      let [inputIdx1, inputIdx2, ...rest] = data;
      data = rest; // reset data after pulling off args
      jump = true;
      pointer = calculate(
        opCode,
        param1 ? inputIdx1 : outputData[inputIdx1],
        param2 ? inputIdx2 : outputData[inputIdx2]
      );
    } else if (opCode === 99) {
      return diagnosticCode;
    } else {
      console.log('unknown opcode', opCode);
      break;
    }

    //refesh data with mutations
    if (jump && pointer !== undefined) {
      data = outputData.slice(pointer);
    } else {
      data = outputData.slice(outputData.length - data.length);
    }
    jump = false;
    pointer = outputData.length - data.length;
  }
};

const getInstruction = opCode => {
  const codes = [...String(opCode)].reverse();
  const instructionArray = [...Array(5).keys()].reverse().map(i => {
    return codes[i] !== undefined ? codes[i] : '0';
  });
  return {
    opCode: Number([instructionArray[3], instructionArray[4]].join('')),
    param1: Boolean(Number(instructionArray[2])), // 0 = postition, 1 = immediate
    param2: Boolean(Number(instructionArray[1])),
    param3: Boolean(Number(instructionArray[0])),
  };
};

const calculate = (opCode, x, y) => {
  if (opCode === 1) return x + y;
  if (opCode === 2) return x * y;
  if (opCode === 5) return x !== 0 ? y : undefined;
  if (opCode === 6) return x === 0 ? y : undefined;
  if (opCode === 7) return x < y ? 1 : 0;
  if (opCode === 8) return x == y ? 1 : 0;
};

const getInput = async () => {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    readline.question(`Input?`, input => {
      readline.close();
      resolve(input);
    });
  });
};

const data = parse(`${__dirname}/data.txt`)
  .split(',')
  .map(Number);

const main = async () => {
  console.log(`Day 5 Part 1 -- ${await day5part1(data)}`);
  console.log(`Day 5 Part 2 -- ${await day5part2(data)}`);
};

main();
