<template>
  <p class="text-center my-4 text-body-1 font-weight-bold">Investment Calculator</p>
  <v-row>
    <v-col cols="12" sm="4">
      <div class="ma-4">
        <v-select
          v-model="form.type"
          density="compact"
          :items="['CRYPTO', 'STOCK']"
          label="Type"
          variant="outlined"
        />
        <v-text-field v-model="form.code" density="compact" label="Code" variant="outlined" />
        <v-text-field
          v-model="form.capital"
          density="compact"
          label="Capital"
          type="number"
          variant="outlined"
        />
        <v-date-input
          v-model="form.buy_date"
          density="compact"
          label="Tanggal Mulai"
          variant="outlined"
        />
        <v-date-input v-model="form.now_date" density="compact" label="Tanggal Akhir" variant="outlined" />
        <v-btn block color="teal" variant="tonal" @click="calculate">
          CALCULATE
        </v-btn>
        <v-divider class="my-4" />
        <v-card v-if="data.data">
          <v-card-text>
            <tbody>
              <tr>
                <td>TYPE</td>
                <td>:</td>
                <td class="font-weight-bold">&nbsp;{{ data.data.type }}</td>
              </tr>
              <tr>
                <td>CODE</td>
                <td>:</td>
                <td class="font-weight-bold">&nbsp;{{ data.data.code }}</td>
              </tr>
              <tr>
                <td>Capital</td>
                <td>:</td>
                <td class="font-weight-bold">&nbsp;Rp. {{ data.data.capital }}</td>
              </tr>
              <tr>
                <td>Kurs Buy</td>
                <td>:</td>
                <td class="font-weight-bold">&nbsp;Rp. {{ data.data.currency_buy }}</td>
              </tr>
              <tr>
                <td>Price Buy (USD)</td>
                <td>:</td>
                <td class="font-weight-bold">&nbsp;${{ data.data.currency_buy }}</td>
              </tr>
              <tr>
                <td>Stock</td>
                <td>:</td>
                <td class="font-weight-bold">&nbsp;{{ data.data.stock }}</td>
              </tr>
              <tr>
                <td>Price Now (USD) &nbsp; &nbsp; &nbsp;</td>
                <td>:</td>
                <td class="font-weight-bold">&nbsp;${{ data.data.price_now }}</td>
              </tr>
              <tr>
                <td>Value (USD)</td>
                <td>:</td>
                <td class="font-weight-bold">&nbsp;${{ data.data.value_in_usd }}</td>
              </tr>
              <tr>
                <td>Return (USD)</td>
                <td>:</td>
                <td class="font-weight-bold" :class="data.data.return_in_usd < 0 ? 'text-red' : 'text-green'">&nbsp;${{ data.data.return_in_usd }}</td>
              </tr>
              <tr>
                <td>Return (Stock)</td>
                <td>:</td>
                <td class="font-weight-bold" :class="data.data.return_in_usd < 0 ? 'text-red' : 'text-green'">&nbsp;{{ data.data.return_in_stock }}</td>
              </tr>
              <tr>
                <td>Percentage</td>
                <td>:</td>
                <td class="font-weight-bold" :class="data.data.return_in_usd < 0 ? 'text-red' : 'text-green'">&nbsp;{{ data.data.percentage }}%</td>
              </tr>
              <tr>
                <td>Kurs Now</td>
                <td>:</td>
                <td class="font-weight-bold">&nbsp;{{ data.data.currency_now }}</td>
              </tr>
              <tr>
                <td>Return (IDR)</td>
                <td>:</td>
                <td class="font-weight-bold" :class="data.data.return_in_usd < 0 ? 'text-red' : 'text-green'">&nbsp;Rp. {{ data.data.return_in_idr }}</td>
              </tr>
            </tbody>
            <pre>{{ data.note }}</pre>
          </v-card-text>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
  import axios from 'axios';

  const form = ref({
    type: null,
    capital: null,
    code: '',
    buy_date: null,
    now_date: null,
  })

  const data = ref({})

  async function calculate () {
    axios.post('http://10.255.253.226:3010/api/calculator', form.value)
      .then(resp => {
        data.value = resp.data;
      })
  }
</script>
