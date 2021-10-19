module.exports = (number) => {
    return !isNaN(parseFloat(number)) && isFinite(number);
}   

// Identify if number