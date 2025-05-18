const axios = require("axios");
require("dotenv").config();

const getCurrency = async (date) => {
  const resp = await axios.get(`${process.env.CURRENCY_API_URL}/historical`, {
    params: {
      apikey: process.env.CURRENCY_API_KEY,
      currencies: "IDR",
      date,
    },
  });

  return {
    datetime: resp.data.meta.last_updated_at,
    value: resp.data.data.IDR.value,
  };
};

module.exports = { getCurrency };
