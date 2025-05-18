const toRupiah = (number) => {
  return Math.floor(number).toLocaleString("id-ID");
};

const toUsd = (number, min = 2, max = 2) => {
  return (Math.round(number * 100) / 100).toLocaleString("en-US", {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });
};

module.exports = { toRupiah, toUsd };
