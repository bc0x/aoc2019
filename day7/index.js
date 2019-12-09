const parse = require('../dataLoader').parse;
const createComputer = require('../IntCodeComputer').createComputer;

const day7part1_bruteForce = (data = []) => {
  const thusterOutput = new Map();
  for (let a = 0; a <= 4; a++) {
    const outputA = intCodeComputer(data, [a, 0]);
    for (let b = 0; b <= 4; b++) {
      const outputB = intCodeComputer(data, [b, outputA]);
      for (let c = 0; c <= 4; c++) {
        const outputC = intCodeComputer(data, [c, outputB]);
        for (let d = 0; d <= 4; d++) {
          const outputD = intCodeComputer(data, [d, outputC]);
          for (let e = 0; e <= 4; e++) {
            const signal = intCodeComputer(data, [e, outputD]);
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

const day7part1 = (data = []) => {
  const thusterOutput = new Map();
  let sequences = [...Array(43211 - 01234).keys()].map(i => i + 01234);
  sequences = sequences
    .filter(sequence => {
      const set = new Set([...String(sequence).padStart(5, '0')]);
      if (set.size === 5 && [...set].every(d => Number(d) <= 4)) {
        return sequence;
      }
    })
    .map(i => String(i).padStart(5, '0'));

  sequences.forEach(sequence => {
    let [a, b, c, d, e] = [...String(sequence)].map(Number);
    let output = 0;
    [a, b, c, d, e].forEach(input => {
      output = intCodeComputer2(data, [input, output]);
    });
    thusterOutput.set(`${a}${b}${c}${d}${e}`, output);
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

const day7part1_refactor = (data = []) => {
  const thusterOutput = new Map();
  let sequences = [...Array(43211 - 01234).keys()].map(i => i + 01234);
  sequences = sequences
    .filter(sequence => {
      const set = new Set([...String(sequence).padStart(5, '0')]);
      if (set.size === 5 && [...set].every(d => Number(d) <= 4)) {
        return sequence;
      }
    })
    .map(i => String(i).padStart(5, '0'));

  sequences.forEach(sequence => {
    let [a, b, c, d, e] = [...String(sequence)].map(Number);
    let output = 0;
    [a, b, c, d, e].forEach(input => {
      const computer = createComputer(data);
      computer.inputs.push(input);
      output = computer.compute(output);
    });
    thusterOutput.set(`${a}${b}${c}${d}${e}`, output);
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

const day7part2 = (data = []) => {
  const thusterOutput = new Map();
  let sequences = [...Array(98766 - 56789).keys()].map(i => i + 56789);
  sequences = sequences.filter(sequence => {
    const set = new Set([...String(sequence)]);
    if (set.size === 5) {
      return sequence;
    }
  });

  sequences.forEach(sequence => {
    const [a, b, c, d, e] = [...String(sequence)].map(Number);
    const amplifiers = [...String(sequence)].map(Number).map((s, i) => {
      const computer = createComputer(data);
      computer.inputs.push(s);
      return computer;
    });
    let output = 0;
    while (!amplifiers.slice(-1)[0].halted) {
      for (amplifier of amplifiers) {
        output = amplifier.compute(output);
      }
    }
    thusterOutput.set(`${a}${b}${c}${d}${e}`, output);
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

const intCodeComputer2 = (data, inputs = []) => {
  let pointer = 0;
  let diagnosticCode = 0;
  let done = false;
  while (true) {
    let { opCode, mode1, mode2, mode3 } = getInstruction(data[pointer]);
    if ([1, 2, 7, 8].includes(opCode)) {
      let [inputIdx1, inputIdx2, outputIdx, ...rest] = data.slice(pointer + 1);
      pointer += 4;
      data[outputIdx] = calculate(
        opCode,
        mode1 ? inputIdx1 : data[inputIdx1],
        mode2 ? inputIdx2 : data[inputIdx2]
      );
    } else if (opCode === 3) {
      let [outputIdx, ...rest] = data.slice(pointer + 1);
      pointer += 2;
      data[outputIdx] = inputs.shift();
    } else if (opCode === 4) {
      let [outputIdx, ...rest] = data.slice(pointer + 1);
      pointer += 2;
      diagnosticCode = mode1 ? outputIdx : data[outputIdx];
      return diagnosticCode;
    } else if ([5, 6].includes(opCode)) {
      let [inputIdx1, inputIdx2, ...rest] = data.slice(pointer + 1);
      pointer = calculate(
        opCode,
        mode1 ? inputIdx1 : data[inputIdx1],
        mode2 ? inputIdx2 : data[inputIdx2],
        (pointer += 3)
      );
    } else if (opCode === 99) {
      done = true;
      return diagnosticCode;
    } else {
      console.log('unknown opcode', opCode);
      break;
    }
  }
};

const getInstruction = opCode => {
  const codes = [...String(opCode)].reverse();
  const instructionArray = [...Array(5).keys()].reverse().map(i => {
    return codes[i] !== undefined ? codes[i] : '0';
  });
  return {
    opCode: Number([instructionArray[3], instructionArray[4]].join('')),
    mode1: Boolean(Number(instructionArray[2])), // 0 = postition, 1 = immediate
    mode2: Boolean(Number(instructionArray[1])),
    mode3: Boolean(Number(instructionArray[0])),
  };
};

const calculate = (opCode, x, y, pointer) => {
  if (opCode === 1) return x + y;
  if (opCode === 2) return x * y;
  if (opCode === 5) return x !== 0 ? y : pointer;
  if (opCode === 6) return x === 0 ? y : pointer;
  if (opCode === 7) return x < y ? 1 : 0;
  if (opCode === 8) return x == y ? 1 : 0;
};

const data = parse(`${__dirname}/data.txt`)
  .split(',')
  .map(Number);

// console.log(`Day 7 Part 1.2 -- ${day7part1(data)}`);
console.log(`Day 7 Part 1.2 -- ${day7part1_refactor(data)}`);
console.log(`Day 7 Part 2 -- ${day7part2(data)}`);
