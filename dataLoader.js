var fs = require('fs');
const parse = (filePath) => fs.readFileSync(filePath).toString();
module.exports = {
  parse
};
