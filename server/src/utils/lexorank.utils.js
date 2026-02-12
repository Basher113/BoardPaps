const BASE = 36;
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

const toNum = (str) => {
  return parseInt(str, BASE);
}

const toStr = (num) => {
  return num.toString(BASE);
}

const pad = (str, length = 10) => {
  return str.padEnd(length, '0');
}

const generateInitialRank = () => {
  return pad('a0');
}

const generateBetween = (prevRank, nextRank) => {
  if (!prevRank && !nextRank) return generateInitialRank();

  if (!prevRank) {
    // Insert at beginning
    const numB = toNum(nextRank);
    return pad(toStr(Math.floor(numB / 2)));
  }

  if (!nextRank) {
    // Insert at end
    const numA = toNum(prevRank);
    return pad(toStr(numA + 1000));
  }

  const numA = toNum(prevRank);
  const numB = toNum(nextRank);

  if (numB - numA <= 1) {
    // Ranks are too close, need to extend
    return pad(prevRank + 'a');
  }

  const middle = Math.floor((numA + numB) / 2);
  return pad(toStr(middle));
}

// Check if a rebalance is needed (ranks too close)

const needsRebalance = (prevRank, nextRank) => {
  if (!prevRank || !nextRank) return false;
  const numA = toNum(prevRank);
  const numB = toNum(nextRank);
  return numB - numA <= 1;
}

// Rebalance all ranks in a column (evenly distributes ranks)
const rebalanceRanks = (ranks) => {
  const total = ranks.length;
  if (total === 0) return [];

  const chunkSize = BASE; // 36
  return ranks.map((_, index) => {
    const position = index * chunkSize;
    let rank = '';
    let n = position;

    do {
      rank = ALPHABET[n % chunkSize] + rank;
      n = Math.floor(n / chunkSize) - 1;
    } while (n >= 0);

    return pad(rank);
  });
}

module.exports = {
  generateBetween,
  needsRebalance,
  rebalanceRanks,
};
