const axios = require("axios");
require("dotenv").config();

const getStockPrice = async (code, buy_date, now_date) => {
  const resp = await axios.get(`${process.env.STOCK_API_URL}/time_series`, {
    params: {
      apikey: process.env.STOCK_API_KEY,
      interval: "1day",
      symbol: code,
      start_date: buy_date,
      end_date: now_date,
      format: "JSON",
      outputsize: "400",
    },
  });

  return {
    priceNow: resp.data.values[0].close,
    priceBuy: resp.data.values[resp.data.values.length - 1].close,
    lastDatetime: resp.data.values[0].datetime,
    oldDatetime: resp.data.values[resp.data.values.length - 1].datetime,
  };
};

const getCryptoPrice = async (code, buy_date, now_date) => {
  const resp = await axios.get(
    `${process.env.CRYPTO_API_URL}/assets/${code}/history`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CRYPTO_API_KEY}`,
      },
      params: {
        interval: "d1",
        start: Math.floor(new Date(buy_date).getTime()),
        end: Math.floor(new Date(now_date).getTime()),
      },
    }
  );

  return {
    priceBuy: resp.data.data[0].priceUsd,
    priceNow: resp.data.data[resp.data.data.length - 1].priceUsd,
    oldDatetime: resp.data.data[0].date,
    lastDatetime: resp.data.data[resp.data.data.length - 1].date,
  };
};

module.exports = { getStockPrice, getCryptoPrice };
