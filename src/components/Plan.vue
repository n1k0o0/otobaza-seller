<template>
  <div v-loading="loading" class="plan" :class="{ current: current }">
    <div class="titleContainer">
      <div class="title">{{ plan.name }}</div>
    </div>
    <div class="infoContainer">
      <div class="price">
        <template v-if="plan.has_price">
          <p>{{ plan.price }} {{ plan.currency_code }}</p>
          <span>/{{ $t('month') }}</span>
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
          if (response.status) {
            window.location.href = response.redirect
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
$accent-color: #409eff;
$text-color: #2d3b48;
$plan-padding: 1em;
$plan-margin: 1em;
$title-background: #409eff;
$title-size: 1.45em;
$price-size: 1.35em;
$feature-size: 1em;
.plan {
  background: #f7f7f7;
  width: 20em;
  box-sizing: border-box;
  text-align: center;
  margin: $plan-margin;
  margin-bottom: $plan-margin;
  outline: 1px solid $accent-color;
  &.current {
    outline: 10px solid $accent-color;
  }
  .titleContainer {
    background-color: $title-background;
    padding: $plan-padding;
    .title {
      font-size: $title-size;
      text-transform: uppercase;
      color: #fff;
      font-weight: 700;
    }
  }
  .infoContainer {
    padding: $plan-padding;
    color: $text-color;
    box-sizing: border-box;
    min-height: 270px;
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
      }
      span {
        font-size: $price-size * 0.75;
        display: inline-block;
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
      li {
        padding: $plan-padding/2;
      }
    }
    .selectPlan {
      border: 2px solid $accent-color;
      padding: $plan-padding * 0.75 $plan-padding;
      border-radius: $plan-padding * 2.5;
      cursor: pointer;
      transition: all 0.25s;
      margin: $plan-margin auto;
      box-sizing: border-box;
      max-width: 70%;
      display: block;
      font-weight: 700;
      &.active {
        &:hover {
          background-color: transparent;
          cursor: auto;
          color: $text-color;
        }
      }
      &:hover {
        background-color: $accent-color;
        color: white;
      }
    }
  }
}
</style>
