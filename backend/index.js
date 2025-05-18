const express = require("express");
require("dotenv").config();
const cors = require('cors')

const currency = require("./services/currency");
const stockPrice = require("./services/stock-price");
const { toRupiah, toUsd } = require("./utils/common");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    exposedHeaders:
      "x_total_data, x_page_limit, x_total_page, x_current_page, x-auth",
  })
);

app.post("/api/calculator", async (req, res) => {
  try {
    let { type, capital, code, buy_date, now_date } = req.body;

    let priceBuy;
    let priceNow;
    let oldDatetime;
    let lastDatetime;
    
    now_date = new Date(new Date(now_date).getTime() + 24 * 60 * 60 * 1000).toISOString();
    
    if (type === "CRYPTO") {
      ({ priceBuy, priceNow, oldDatetime, lastDatetime } =
        await stockPrice.getCryptoPrice(code, buy_date, now_date));
    } else {
      ({ priceBuy, priceNow, oldDatetime, lastDatetime } =
        await stockPrice.getStockPrice(code, buy_date, now_date));
    }
    const currencyBuy = await currency.getCurrency(oldDatetime);
    const currencyNow = await currency.getCurrency(lastDatetime);

    const capitalInUsd = capital / currencyBuy.value;
    const stock = capitalInUsd / priceBuy;
    const valueInUsd = priceNow * stock;
    const returnInUsd = valueInUsd - capitalInUsd;
    const returnInStock = returnInUsd / priceNow;
    const returnInIdr = returnInUsd * currencyNow.value;
    const percentage = ((valueInUsd - capitalInUsd) / valueInUsd) * 100;

    return res.json({
      data: {
        type,
        code,
        capital: toRupiah(capital),
        currency_buy: toRupiah(currencyBuy.value),
        capital_in_usd: toUsd(capitalInUsd),
        price_buy: priceBuy,
        stock: toUsd(stock),
        price_now: priceNow,
        value_in_usd: toUsd(valueInUsd),
        return_in_usd: toUsd(returnInUsd),
        return_in_stock: toUsd(returnInStock),
        percentage: toUsd(percentage),
        currency_now: toRupiah(currencyNow.value),
        return_in_idr: toRupiah(returnInIdr),
      },
      note: {
        stock_time: {
          last_time: lastDatetime,
          old_time: oldDatetime,
        },
        kurs_time: {
          last_time: currencyNow.datetime,
          old_time: currencyBuy.datetime,
        },
      },
    });
  } catch (err) {
    res.json(err);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`API Running on port ${process.env.PORT}`)
);
