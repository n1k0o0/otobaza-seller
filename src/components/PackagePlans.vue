<template>
  <div v-loading="loading" class="PackagePlans">
    <div v-if="!loading" class="planContainer">
      <Plan
        v-for="plan in packages"
        :key="plan.id"
        :current="activePackage(plan.id)"
        :plan="plan"
      />
    </div>
  </div>
</template>
<script>
import Plan from '@/components/Plan'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'PackagePlans',
  components: { Plan },
  data() {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      packages: 'packages/packages',
      currencies: 'app/currencies',
      currency: 'app/currency',
      current_package: 'packages/current_package'
    })
  },
  watch: {
    async currency() {
      await this.getPackages()
    }
  },
  async beforeMount() {
    if (!this.currencies.length) {
      await this.GET_CURRENCIES()
    }
    await this.getPackages()
  },
  methods: {
    ...mapActions({
      GET_SELLER_PACKAGES: 'packages/GET_SELLER_PACKAGES',
      GET_SELLER_PACKAGE: 'packages/GET_SELLER_PACKAGE',
      GET_CURRENCIES: 'app/GET_CURRENCIES'
    }),
    async getPackages() {
      const currency = this.currencies.find(item => item.id === this.currency)
      await this.GET_SELLER_PACKAGES({
        currency: currency?.currency_code
      })
      await this.GET_SELLER_PACKAGE()
      this.loading = false
    },
    activePackage(id) {
      return this.current_package.seller_package_id === id
    }
  }
}
</script>
<style lang="scss" scoped>
$plan-margin: 1em;

.planContainer {
  display: flex;
  flex-wrap: wrap;
  margin: $plan-margin;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
}

@media screen and (max-width: 25em) {
  .planContainer {
    margin: 0;
    .plan {
      width: 100%;
      margin: $plan-margin 0;
    }
  }
}
</style>
