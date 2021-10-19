module.exports = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random number with min and max values