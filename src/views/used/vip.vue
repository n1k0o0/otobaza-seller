<template>
  <div class="PageContainer">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="Breadcrumbs"
    >
      <el-breadcrumb-item :to="{ path: '/' }">
        {{
          $t('dashboard.title')
        }}
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/used' }">
        {{ $t('menu.used') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'EditUsed',param:{id:product.id} }">
        {{ product.title }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>VIP</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card
      v-loading="loading"
      shadow="always"
    >
      <template #header>
        <div>
          <div class="left">
            <svg
              icon="el-icon-back"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              @click="$router.push({ name: 'EditUsed',param:{id:product.id} })"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="#344054"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <h2>{{ $t('actions.tariff_vip') }} <span> #{{ product.id }}</span></h2>
          </div>

          <p class="info_text">
            {{ $t('actions.tariff_vip_text') }}
          </p>
        </div>
      </template>

      <div>
        <el-radio-group v-model="chosenDay">
          <el-radio
            v-for="vip in vip_list"
            :key="vip.id"
            :label="vip.id"
          >
            {{ vip.service_period_in_days }} {{ $t('day') }} ( {{ $t('random') }} ) - {{ vip.price }} {{ vip.price_type.currency_code }}
          </el-radio>
        </el-radio-group>
      </div>

      <div class="el-card__footer">
        <el-row
          justify="space-around"
          type="flex"
          align="middle"
        >
          <el-col
            :span="20"
            class="payment_info"
          >
            {{ $t('payment_method') }}: <span>{{ $t('payment_method_card') }}</span>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              :disabled="!product.id || !chosenDay"
              @click="pay"
            >
              {{ $t('actions.pay') }}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.16602 7.00002H12.8327M12.8327 7.00002L6.99935 1.16669M12.8327 7.00002L6.99935 12.8334"
                  stroke="white"
                  stroke-width="1.67"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </el-button>
          </el-col>
        </el-row>
        <p>
          {{ $t('actions.pay_note') }}
        </p>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Used',
  data () {
    return {
      chosenDay: 0
    }
  },
  computed: {
    ...mapGetters({
      product: 'used/product',
      currencies: 'app/currencies',
      vip_list: 'used/vip_list',
      loading: 'used/loading',
    }),
  },
  async beforeMount () {
    await this.GET_PRODUCT(this.$route.params.id)
    await this.GET_VIP()
  },
  methods: {
    ...mapActions({
      GET_PRODUCT: 'used/GET_PRODUCT',
      PAY_VIP: 'used/PAY_VIP',
      GET_VIP: 'used/GET_VIP',
    }),
    async save () {
      this.loading = true
      try {
        await this.SAVE_PRODUCT()

        this.edit = false
        this.$message({
          message: 'Success.',
          type: 'success'
        })
      } finally {
        this.loading = false
      }

    },
    async pay () {
      await this.PAY_VIP({ partId: this.product.id, serviceId: this.chosenDay })
    }
  },
}
</script>

<style lang="scss" scoped>
.payment_info {
  font-size: 16px;
  line-height: 24px;
  color: #344054;

  span {
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
    color: #0086C9;
    font-style: italic;
  }
}

.el-radio-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

</style>
