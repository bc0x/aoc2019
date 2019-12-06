const day = process.argv[2]
try {
  require(`./${day}/index.js`)
} catch (ex) {
  if (!day) {
    console.error('No solution ID provided; please re-run with an argument, e.g.: npm start day1, or: node run day1')
  } else {
    console.error(`Unable to run solution for '${day}': ${ex}`, ex.stack)
  }
}
