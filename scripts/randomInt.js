module.exports = (max = 0, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random number with min and max values
