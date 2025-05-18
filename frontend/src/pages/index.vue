<template>
  <p class="text-center my-4 text-body-1 font-weight-bold">Investment Calculator</p>
  <v-row class="px-2">
    <v-col class="px-4" cols="12" sm="6">
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
      <v-btn
        block
        class="mb-4"
        color="teal"
        variant="tonal"
        @click="calculate"
      >
        CALCULATE
      </v-btn>
    </v-col>
    <v-col class="px-4" cols="12" sm="6">
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
              <td class="font-weight-bold">&nbsp;{{ data.data.code.toUpperCase() }}</td>
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
              <td>Capital (USD)</td>
              <td>:</td>
              <td class="font-weight-bold">&nbsp;${{ data.data.capital_in_usd }}</td>
            </tr>
            <tr>
              <td>Price Buy (USD)</td>
              <td>:</td>
              <td class="font-weight-bold">&nbsp;${{ data.data.price_buy }}</td>
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
              <td class="font-weight-bold" :class="parseFloat(data.data.return_in_usd.replace(/,/g, '')) < 0 ? 'text-red' : 'text-green'">&nbsp;${{ data.data.return_in_usd }}</td>
            </tr>
            <tr>
              <td>Return (Stock)</td>
              <td>:</td>
              <td class="font-weight-bold" :class="parseFloat(data.data.return_in_stock.replace(/,/g, '')) < 0 ? 'text-red' : 'text-green'">&nbsp;{{ data.data.return_in_stock }}</td>
            </tr>
            <tr>
              <td>Percentage</td>
              <td>:</td>
              <td class="font-weight-bold" :class="parseFloat(data.data.percentage.replace(/,/g, '')) < 0 ? 'text-red' : 'text-green'">&nbsp;{{ data.data.percentage }}%</td>
            </tr>
            <tr>
              <td>Kurs Now</td>
              <td>:</td>
              <td class="font-weight-bold">&nbsp;{{ data.data.currency_now }}</td>
            </tr>
            <tr>
              <td>Return (IDR)</td>
              <td>:</td>
              <td class="font-weight-bold" :class="parseFloat(data.data.return_in_idr.replace(/,/g, '')) < 0 ? 'text-red' : 'text-green'">&nbsp;Rp. {{ data.data.return_in_idr }}</td>
            </tr>
          </tbody>
          <v-btn
            block
            class="my-4"
            color="orange"
            variant="tonal"
            @click="addPorto(data.data)"
          >
            ADD PORTOFOLIO
          </v-btn>
          <v-divider class="my-4" />
          <pre>{{ data.note }}</pre>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row class="px-2">
    <v-col class="px-4" cols="12" sm="6">
      <v-table v-if="portofolio.length > 0" density="compact">
        <thead>
          <tr>
            <th class="text-center">
              No
            </th>
            <th class="text-left">
              CODE
            </th>
            <th class="text-right">
              Capital
            </th>
            <th class="text-right">
              Return
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in portofolio"
            :key="item.code"
          >
            <td class="text-center">{{ i+1 }}</td>
            <td class="text-left">{{ item.name.toUpperCase() }}</td>
            <td class="text-right">Rp. {{ item.capital }}</td>
            <td class="text-right">Rp. {{ item.return }}</td>
          </tr>
          <tr>
            <td class="text-center font-weight-bold" colspan="2">TOTAL</td>
            <td class="text-right">Rp. {{ new Intl.NumberFormat('id-ID').format(totalCapital) }}</td>
            <td class="text-right" :class="totalReturn < 0 ? 'text-red' : 'text-green'">Rp. {{ new Intl.NumberFormat('id-ID').format(totalReturn) }}</td>
          </tr>
        </tbody>
      </v-table>
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

  const portofolio = ref([]);

  async function calculate () {
    axios.post('http://10.255.253.226:3010/api/calculator', form.value)
      .then(resp => {
        data.value = resp.data;
      })
  }

  async function addPorto (d) {
    portofolio.value.push({ name: d.code, capital: d.capital, return: d.return_in_idr })
  }

  const totalCapital = computed(() =>
    portofolio.value.reduce((sum, item) => sum + Number(item.capital.replace(/\./g, '')), 0)
  )

  const totalReturn = computed(() =>
    portofolio.value.reduce((sum, item) => sum + Number(item.return.replace(/\./g, '')), 0)
  )
</script>
