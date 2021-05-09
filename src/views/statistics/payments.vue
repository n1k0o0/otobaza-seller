<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
        $t('dashboard.title')
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('payment_history.title') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="16">
      <el-col :xs="24">
        <transition name="fade-transform" mode="out-in">
          <el-alert
            v-if="message.is_visible"
            :title="$t('information')"
            :type="message.type"
            :description="$t(`payment_alerts.${message.type}`)"
            show-icon
            class="mb-1"
            @close="onCloseAlert"
          />
        </transition>
      </el-col>
      <el-col :xs="24" :sm="16" :lg="18">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <h2>{{ $t('payment_history.title') }}</h2>
          </div>
          <el-table
            v-loading="listLoading"
            :data="payment_history"
            border
            fit
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column
              prop="created_at"
              :label="$t('payment_history.created_at')"
            >
              <template slot-scope="{ row }">
                {{ getDate(row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="amount"
              :label="$t('payment_history.amount')"
            >
              <template slot-scope="{ row }">
                {{ row.amount }} {{ row.currency }}
              </template>
            </el-table-column>
            <el-table-column
              prop="last_status"
              :label="$t('payment_history.last_status')"
            >
              <template slot-scope="{ row }">
                <el-popover trigger="hover" placement="bottom-start">
                  <el-timeline class="timeline">
                    <el-timeline-item
                      v-for="(history, index) in row.status_history"
                      :key="index"
                      hide-timestamp
                    >
                      <small>{{ history.status }}</small>
                    </el-timeline-item>
                  </el-timeline>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="normal">{{ row.last_status }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="description"
              :label="$t('payment_history.description')"
            >
              <template slot-scope="{ row }">
                {{ row.description }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            background
            layout="prev, pager, next"
            :page-size="pagination.per_page"
            hide-on-single-page
            :total="pagination.total"
            @current-change="pageChange"
          />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="6">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="balance" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{ $t('payment_history.balance') }}
            </div>
            <count-to
              :start-val="0"
              :end-val="balance"
              :decimals="1"
              :duration="1000"
              class="card-panel-num"
            />
            <span>USD</span>
          </div>
        </div>

        <el-card v-loading="loadingPay" shadow="always">
          <div slot="header" class="clearfix">
            <h2>{{ $t('payment_history.add_payment') }}</h2>
          </div>
          <form action="" @submit.prevent="pay">
            <div class="payment-input">
              <el-input-number v-model="amount" :min="min_amount" />
              <div class="azn">USD</div>
            </div>
            <el-button
              native-type="submit"
              type="primary"
              :disabled="!amount || amount < min_amount"
              class="w100"
            >{{ $t('payment_history.pay') }}</el-button>
          </form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import CountTo from 'vue-count-to'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
export default {
  name: 'PaymentHistory',
  components: {
    CountTo
  },
  data() {
    return {
      loadingPay: false,
      listLoading: true,
      page: 1,
      amount: 0,
      message: {
        type: '',
        is_visible: false
      }
    }
  },
  computed: {
    ...mapGetters({
      payment_history: 'statistics/payment_history',
      pagination: 'statistics/pagination',
      min_amount: 'statistics/min_amount',
      dashboard: 'app/dashboard'
    }),
    balance() {
      return this.dashboard.balance || 0
    }
  },
  async beforeMount() {
    await this.getPaymentHistory()
    await this.$store.dispatch('app/GET_DASHBOARD')
  },
  mounted() {
    if (Object.keys(this.$route.query).includes('success')) {
      const status = this.$route.query.success
      if (status === 'true') {
        this.message.is_visible = true
        this.message.type = 'success'
      } else if (status === 'false') {
        this.message.is_visible = true
        this.message.type = 'error'
      }
    }
  },
  methods: {
    onCloseAlert() {
      this.message.is_visible = false
      this.message.type = ''
    },
    async pay() {
      this.loadingPay = true
      await this.$store
        .dispatch('statistics/PAY_AMOUNT', this.amount)
        .then(response => {
          if (response.status) {
            window.location.href = response.redirect
          }
        })
    },
    getDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    async getPaymentHistory() {
      this.listLoading = true
      await this.$store
        .dispatch('statistics/GET_PAYMENT_HISTORY', {
          page: this.page
        })
        .finally(() => {
          this.listLoading = false
        })
      await this.$store.dispatch('statistics/GET_MINIMUM_AMOUNT')
      this.amount = this.min_amount
    },
    async pageChange(page) {
      this.page = page
      await this.getPaymentHistory()
    }
  }
}
</script>
<style lang="scss" scoped>
.timeline {
  margin-bottom: -20px !important;
  padding-left: 10px;
}
.el-input-number {
  width: 100%;
}
.payment-input {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  .azn {
    line-height: 38px;
    flex-grow: 0;
    font-size: 14px;
    background: #f5f7fa;
    color: #606266;
    border-radius: 0 4px 4px 0;
    border: 1px solid #dcdfe6;
    border-left: 0;
    padding: 0 10px;
  }
}
.card-panel {
  height: 108px;
  margin-bottom: 16px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);

  .card-panel-icon-wrapper {
    color: #fff;
  }

  .icon-people {
    background: #40c9c6;
  }

  .icon-message {
    background: #36a3f7;
  }

  .icon-money {
    color: #f4516c;
  }

  .icon-shopping {
    color: #34bfa3;
  }

  .card-panel-icon-wrapper {
    float: left;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }

  .card-panel-icon {
    float: left;
    font-size: 48px;
  }

  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 26px;
    margin-left: 0px;

    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }

    .card-panel-num {
      font-size: 20px;
    }
  }
}
</style>
