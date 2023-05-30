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
    <el-card shadow="always">
      <template #header>
        <div>
          <div class="left">
            <svg
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

            <h2>{{ $t('actions.tariff_special') }} <span> #{{ product.id }}</span></h2>
          </div>

          <p class="info_text">
            {{ $t('actions.tariff_special_text') }}
          </p>
        </div>
      </template>

      <el-row>
        <el-col
          :span="12"
          class="block"
        >
          <label for="dates">{{ $t('used.special_service_dates_label') }} :</label>
          <el-date-picker
            id="dates"
            v-model="dates"
            class="d-block mt-4"
            type="dates"
            :picker-options="pickerOptions"
            clearable
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :placeholder="$t('used.choose_dates')"
          />
          <p>
            * {{ special_list.slots.join(',') }} -> {{ $t('used.busy') }}
          </p>
        </el-col>
        <el-col
          :span="12"
          class="info"
        >
          <div>
            <span>{{ $t('used.special_service_period') }}:</span>
            <p>
              {{ dates?.length ?? 0 }} {{ $t('day') }} ( {{ dates?.join(',') }} )
            </p>
          </div>
          <div>
            <span>{{ $t('used.special_service_cost') }}:</span>
            <p>1 {{ $t('day') }} - 20 azn</p>
          </div>
          <div>
            <span>{{ $t('orders.total_price') }}:</span>
            <p class="price">
              {{ dates?.length ?? 0 }} {{ $t('day') }} - {{ 20 * (dates?.length || 0) }} AZN
            </p>
          </div>
        </el-col>
      </el-row>

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
              :disabled="!product.id || (!dates || !dates.length)"
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
      dates: [],
      loading: false,
      chosenDay: 1,
      pickerOptions2: {
        disabledDate (time) {
          let tt = time.toISOString().substring(0, 10)
          console.log(111, this)

          return ['2023-05-18'].includes(tt) || time.getTime() < Date.now()
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      product: 'used/product',
      currencies: 'app/currencies',
      special_list: 'used/special_list',
    }),
    pickerOptions () {
      let slots = this.special_list.slots

      return {
        disabledDate (time) {
          let date = new Date(time)

          let tt = date.getFullYear() + '-' +
            (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
            date.getDate().toString().padStart(2, '0')

          return slots.includes(tt) || time.getTime() < Date.now()
        }
      }
    }
  },
  async mounted () {
    await this.GET_PRODUCT(this.$route.params.id)
    await this.GET_SPECIAL()
  },
  methods: {
    ...mapActions({
      GET_PRODUCT: 'used/GET_PRODUCT',
      GET_SPECIAL: 'used/GET_SPECIAL',
      PAY_SPECIAL: 'used/PAY_SPECIAL',
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
      await this.PAY_SPECIAL({ partId: this.product.id, dates: this.dates })
    },
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

.block {
  p, label {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #98A2B3;
  }
}

.info {
  span {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #98A2B3;
  }

  p {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #344054;
  }

  p.price {
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    color: #0086C9;
  }
}

</style>
