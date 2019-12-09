const parse = require('../dataLoader').parse;

const day7part1 = async (data = []) => {
  const thusterOutput = new Map();
  for (let a = 0; a <= 4; a++) {
    const outputA = intCodeComputer(data, a, 0);
    for (let b = 0; b <= 4; b++) {
      const outputB = intCodeComputer(data, b, outputA);
      for (let c = 0; c <= 4; c++) {
        const outputC = intCodeComputer(data, c, outputB);
        for (let d = 0; d <= 4; d++) {
          const outputD = intCodeComputer(data, d, outputC);
          for (let e = 0; e <= 4; e++) {
            const signal = intCodeComputer(data, e, outputD);
            const sequence = `${a}${b}${c}${d}${e}`;
            thusterOutput.set(sequence, signal);
          }
        }
      }
    }
  }

  // get sequences that have unique digits
  thusterOutput.forEach((signal, sequence) => {
    const set = new Set([...sequence]);
    if (set.size < 5) {
      thusterOutput.delete(sequence);
    }
  });

  const result = [...thusterOutput.entries()].reduce(
    (acc, [sequence, signal]) => {
      return signal > acc.signal
        ? {
            sequence,
            signal,
          }
        : acc;
    },
    {
      sequence: 0,
      signal: 0,
    }
  );
  return `${result.sequence} - ${result.signal}`;
};

const day7part2 = async (data = []) => {
  return 0;
};

const intCodeComputer = (data, userInput, prevOutput) => {
  let outputData = [...data];
  let pointer = outputData.length - data.length;
  let jump = false;
  let init = true;
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
      if (init) {
        outputData[outputIdx] = userInput;
        init = false;
      } else {
        outputData[outputIdx] = prevOutput;
      }
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

const data = parse(`${__dirname}/data.txt`)
  .split(',')
  .map(Number);

const main = async () => {
  console.log(`Day 5 Part 1 -- ${await day7part1(data)}`);
  // console.log(`Day 5 Part 2 -- ${await day5part2(data)}`);
};

main();
