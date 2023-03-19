<template>
  <div v-loading="loading" class="plan" :class="{ current: current }">
    <div class="titleContainer">
      <div class="title">{{ plan.name }}</div>
    </div>
    <div class="infoContainer">
      <div class="price">
        <template v-if="plan.has_price">
          <p class="price_price">{{ plan.price }} {{ plan.currency_code }}</p>
          <span class="price_month">/{{ $t('month') }}</span>
        </template>
        <template v-else>
          <p>{{ $t('free') }}</p>
        </template>
      </div>
      <ul class="features">
        <li>
          {{ $t('limit') }}: <strong>{{ plan.limit }}</strong>
        </li>
        <li>
          {{ $t('period') }}:
          <template v-if="plan.expires_after_month">
            <strong>{{ plan.expires_after_month }} {{ $t('month') }}</strong>
          </template>
          <template v-else>
            <strong>{{ $t('timeless') }}</strong>
          </template>
        </li>
      </ul>
      <template v-if="current">
        <span class="selectPlan active">{{ $t('current_plan') }}</span>
      </template>
      <template v-else>
        <a
          class="selectPlan"
          href="#"
          @click.prevent="choosePackage(plan.id)"
        >{{ $t('select_plan') }}</a>
      </template>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'Plan',
  props: {
    current: {
      type: Boolean,
      defaukt: false
    },
    plan: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    ...mapActions({
      SELLER_PACKAGE_CHANGE: 'packages/SELLER_PACKAGE_CHANGE'
    }),
    async choosePackage(seller_package_id) {
      this.loading = true
      await this.SELLER_PACKAGE_CHANGE(seller_package_id)
        .then(response => {
          if (response.data.status) {
            window.location.href = response.data.redirect
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss">
$accent-color: #0086C9;
$text-color: #2d3b48;
$plan-padding: 1em;
$plan-margin: 1em;
$title-background: #409eff;
$title-size: 1em;
$price-size: 24px;
$feature-size: 1em;
.plan {
  box-sizing: border-box;
  padding: $plan-margin;
  background: #FFFFFF;
  /* Gray/100 */

  border: 1px solid #F2F4F7;
  border-radius: 16px;

  &.current {
    .infoContainer {
      .selectPlan {
        /* Blue light/50 */
        background: #F0F9FF;
        /* Blue light/50 */
        border: 1px solid #F0F9FF;
        /* Shadow/xs */
        box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
        border-radius: 8px;
        color: #0086C9;
      }
    }
  }

  .titleContainer {

    .title {
      font-size: $title-size;
      font-weight: 400;
      line-height: 24px;
      text-transform: capitalize;
      color: #344054;
    }
  }
  .infoContainer {
    color: $text-color;
    box-sizing: border-box;
    text-align: left;

    .price {
      font-size: $price-size;
      padding: $plan-padding 0;
      font-weight: 600;
      margin-top: 0;
      display: inline-block;
      width: 80%;

      p {
        font-size: $price-size;
        display: inline-block;
        margin: 0;
        font-weight: 500;
        line-height: 32px;
        color: #0086C9;
      }
      span {
        font-size: 16px;
        display: inline-block;
        color: #98A2B3;
      }
    }
    .desc {
      padding-bottom: $plan-padding;
      border-bottom: 2px solid $title-background;
      margin: 0 auto;
      width: 90%;
      em {
        font-size: $feature-size;
        font-weight: 500;
      }
    }
    .features {
      font-size: $feature-size;
      list-style: none;
      padding-left: 0;
      color: #344054;
      line-height: 20px;
      font-weight: 400;

      li {
        padding: $plan-padding/2;
      }
    }
    .selectPlan {
      background: #FFFFFF;
      /* Gray/300 */
      border: 1px solid #D0D5DD;
      /* Shadow/xs */
      box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);

      border-radius: 8px;
      cursor: pointer;
      transition: all 0.25s;
      margin: $plan-margin auto;
      box-sizing: border-box;
      font-weight: 700;
      width: 100%;

      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 8px 14px;
      color: #344054;


      &:hover {
        background-color: $accent-color;
        color: white;
      }
    }
  }
}
</style>
