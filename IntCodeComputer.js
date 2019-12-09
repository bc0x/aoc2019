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
      if (opCode === 5) return x !== 0 ? y : pointer;
      if (opCode === 6) return x === 0 ? y : pointer;
      if (opCode === 7) return x < y ? 1 : 0;
      if (opCode === 8) return x == y ? 1 : 0;
    },
    getInstruction(opCode) {
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
    },
    compute(inputValue) {
      this.inputs.push(inputValue);
      while (this.pointer < this.data.length) {
        let { opCode, mode1, mode2 } = this.getInstruction(
          this.data[this.pointer]
        );
        if ([1, 2, 7, 8].includes(opCode)) {
          let [inputIdx1, inputIdx2, outputIdx] = this.data.slice(
            this.pointer + 1
          );
          this.pointer += 4;
          this.data[outputIdx] = this.calculate(
            opCode,
            mode1 ? inputIdx1 : this.data[inputIdx1],
            mode2 ? inputIdx2 : this.data[inputIdx2]
          );
        } else if (opCode === 3) {
          let [outputIdx] = this.data.slice(this.pointer + 1);
          this.pointer += 2;
          this.data[outputIdx] = this.inputs.shift();
        } else if (opCode === 4) {
          let [outputIdx] = this.data.slice(this.pointer + 1);
          this.pointer += 2;
          this.output = mode1 ? outputIdx : this.data[outputIdx];
          return this.output;
        } else if ([5, 6].includes(opCode)) {
          let [inputIdx1, inputIdx2] = this.data.slice(this.pointer + 1);
          this.pointer = this.calculate(
            opCode,
            mode1 ? inputIdx1 : this.data[inputIdx1],
            mode2 ? inputIdx2 : this.data[inputIdx2],
            (this.pointer += 3)
          );
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
