<template>
  <el-dropdown
    v-if="currency"
    trigger="click"
    class="international"
    @command="handleCurrency"
  >
    <div><svg-icon icon-class="currency" /> {{ currency }}</div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="cur in currencies"
        :key="cur.id"
        :command="cur.id"
      >
        {{ cur.currency_code }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  computed: {
    currencies() {
      return this.$store.getters['app/currencies']
    },
    currency() {
      const selectedCurrencyId = this.$store.getters['app/currency']
      return (
        this.currencies.find(currency => currency.id === selectedCurrencyId)
          ?.currency_code || false
      )
    }
  },
  async beforeMount() {
    await this.GET_CURRENCIES()
  },
  methods: {
    ...mapActions({
      GET_CURRENCIES: 'app/GET_CURRENCIES'
    }),
    ...mapMutations({
      SET_CURRENCY: 'app/SET_CURRENCY'
    }),
    handleCurrency(currency) {
      this.SET_CURRENCY(currency)
      this.$message({
        message: this.$t('successfully_currency_changed'),
        type: 'success'
      })
      localStorage.setItem('currency', currency)
    }
  }
}
</script>
