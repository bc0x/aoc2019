const createComputer = data => {
  return {
    data,
    pointer: 0,
    output: null,
    inputs: [],
    halted: false,
    calculate(opCode, x, y, pointer) {
      if (opCode === 1) return x + y;
      if (opCode === 2) return x * y;
      if (opCode === 3) return this.inputs.shift();
      if (opCode === 5) return x !== 0 ? y : false;
      if (opCode === 6) return x === 0 ? y : false;
      if (opCode === 7) return x < y ? 1 : 0;
      if (opCode === 8) return x == y ? 1 : 0;
    },
    getInstruction() {
      const codes = [...String(this.data[this.pointer])].reverse();
      const instructionArray = [...Array(5).keys()].reverse().map(i => {
        return codes[i] !== undefined ? codes[i] : '0';
      });
      this.pointer += 1;
      return {
        opCode: Number([instructionArray[3], instructionArray[4]].join('')),
        mode1: Boolean(Number(instructionArray[2])), // 0 = postition, 1 = immediate
        mode2: Boolean(Number(instructionArray[1])),
        mode3: Boolean(Number(instructionArray[0])),
      };
    },
    getParams(numParams) {
      const arr = this.data.slice(this.pointer);
      this.pointer += numParams;
      return arr;
    },
    compute(inputValue) {
      this.inputs.push(inputValue);
      while (this.pointer < this.data.length) {
        const { opCode, mode1, mode2 } = this.getInstruction();
        if ([1, 2, 7, 8].includes(opCode)) {
          const [inputIdx1, inputIdx2, outputIdx] = this.getParams(3);
          const param1 = mode1 ? inputIdx1 : this.data[inputIdx1];
          const param2 = mode2 ? inputIdx2 : this.data[inputIdx2];
          this.data[outputIdx] = this.calculate(opCode, param1, param2);
        } else if (opCode === 3) {
          const [outputIdx] = this.getParams(1);
          this.data[outputIdx] = this.calculate(opCode);
        } else if (opCode === 4) {
          const [outputIdx] = this.getParams(1);
          this.output = mode1 ? outputIdx : this.data[outputIdx];
          return this.output;
        } else if ([5, 6].includes(opCode)) {
          const [inputIdx1, inputIdx2] = this.getParams(2);
          const param1 = mode1 ? inputIdx1 : this.data[inputIdx1];
          const param2 = mode2 ? inputIdx2 : this.data[inputIdx2];
          this.pointer = this.calculate(opCode, param1, param2) || this.pointer;
          this;
        } else if (opCode === 99) {
          this.halted = true;
          return this.output;
        } else {
          console.log('unknown opcode', opCode);
          break;
        }
      }
    },
  };
};

module.exports = {
  createComputer,
};
