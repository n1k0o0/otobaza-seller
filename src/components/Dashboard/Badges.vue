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
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink">
          <rect width="48" height="48" rx="24" fill="#F9FAFB"/>
          <rect x="8" y="8" width="32" height="32" fill="url(#pattern0)"/>
          <defs>
            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlink:href="#image0_2212_67437" transform="scale(0.0104167)"/>
            </pattern>
            <image id="image0_2212_67437" width="96" height="96"
                   xlink:href="data:image/png;base64,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"/>
          </defs>
        </svg>

      </div>
      <div class="card-panel-description">
        <div class="card-panel-text">
          {{ $t('packages.expiration') }}
        </div>
        <div class="card-panel-num">
          {{ dashboard.package_expire_date }}
        </div>
        <div class="cart-panel-increase" @click="$router.push({name:'PackagesLayout'})">
          {{ $t('extend_period') }}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.16719 4.33219C8.89002 4.33219 8.66703 4.10816 8.66703 3.83203C8.66703 3.55591 8.89002 3.33188 9.16719 3.33188H12.1681C12.4453 3.33188 12.6683 3.55591 12.6683 3.83203V6.83297C12.6683 7.11014 12.4453 7.33313 12.1681 7.33313C11.891 7.33313 11.668 7.11014 11.668 6.83297V5.03866L7.50208 9.16912C7.32495 9.38169 7.00818 9.38169 6.81229 9.16912C6.61847 8.99198 6.61847 8.67521 6.81229 8.47932L10.9615 4.33219H9.16719ZM3.33203 5.16578C3.33203 4.52121 3.85449 3.99875 4.49906 3.99875H6.83313C7.1103 3.99875 7.33328 4.22278 7.33328 4.49891C7.33328 4.77608 7.1103 4.99907 6.83313 4.99907H4.49906C4.40695 4.99907 4.33234 5.07409 4.33234 5.16578V11.5011C4.33234 11.5928 4.40695 11.6678 4.49906 11.6678H10.8344C10.9261 11.6678 11.0011 11.5928 11.0011 11.5011V9.16704C11.0011 8.88986 11.2241 8.66688 11.5013 8.66688C11.7784 8.66688 12.0014 8.88986 12.0014 9.16704V11.5011C12.0014 12.145 11.4783 12.6681 10.8344 12.6681H4.49906C3.85449 12.6681 3.33203 12.145 3.33203 11.5011V5.16578Z"
              fill="#086BFF"/>
          </svg>
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
  display: flex;
  gap: 24px;


  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    border-radius: 16px;
    padding: 16px;
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
      //background: #36a3f7;
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
      margin-right: 8px;
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
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #98A2B3;
      }

      .card-panel-num {
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #0086C9;
      }

      .cart-panel-increase {
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #086BFF;
        display: flex;

        svg {
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
