<template>
  <div class="panel-group">
    <div class="card-panel">
      <div class="card-panel-icon-wrapper icon-people">
        <svg-icon icon-class="balance" class-name="card-panel-icon" />
      </div>
      <div class="card-panel-description">
        <div class="card-panel-text">{{ $t('payment_history.balance') }}</div>
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
    <div class="card-panel">
      <div class="card-panel-icon-wrapper icon-message">
        <svg-icon icon-class="expire" class-name="card-panel-icon" />
      </div>
      <div class="card-panel-description">
        <div class="card-panel-text">
          {{ $t('packages.expiration') }}
        </div>
        <div class="card-panel-num">
          {{ expire }}
        </div>
      </div>
    </div>
    <div class="card-panel">
      <div class="card-panel-icon-wrapper icon-money">
        <svg-icon icon-class="products" class-name="card-panel-icon" />
      </div>
      <div class="card-panel-description">
        <div class="card-panel-text">
          {{ $t('parts.parts_count') }}
        </div>
        <div class="card-panel-num">
          {{ total }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { mapGetters } from 'vuex'
export default {
  name: 'Badges',
  components: {
    CountTo
  },
  computed: {
    ...mapGetters({
      dashboard: 'app/dashboard'
    }),
    balance() {
      return this.dashboard.balance || 0
    },

    total() {
      return this.dashboard?.total_products || '-'
    },

    expire() {
      const expire =
        (this.dashboard?.package_expire_date_cute &&
          this.dashboard?.package_expire_date) ||
        ''
      return expire
        ? `${this.dashboard.package_expire_date_cute} ( ${this.dashboard.package_expire_date} )`
        : ''
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    height: 108px;
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
      background: #f4516c;
      color: #fff;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      font-weight: bold;
      margin-left: 0;

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
}
</style>
