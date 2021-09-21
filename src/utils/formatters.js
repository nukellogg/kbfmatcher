function roundNumber(val, places) {
  let multiplier = Math.pow(10, places);
  return Math.trunc(multiplier * val) / multiplier;
}

module.exports = { roundNumber }
