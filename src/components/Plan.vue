<template>
  <div v-loading="loading" class="plan" :class="{ current: current }">
    <div class="titleContainer">
      <div class="title">
        <img :src="getImgUrl(plan.name)" alt="plan.name">
        <span>{{ plan.name }}</span>
      </div>
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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M12.3536 3.64645C12.5488 3.84171 12.5488 4.15829 12.3536 4.35355L5.35355 11.3536C5.25979 11.4473 5.13261 11.5 5 11.5C4.86739 11.5 4.74021 11.4473 4.64645 11.3536L1.14645 7.85355C0.951184 7.65829 0.951184 7.34171 1.14645 7.14645C1.34171 6.95118 1.65829 6.95118 1.85355 7.14645L5 10.2929L11.6464 3.64645C11.8417 3.45118 12.1583 3.45118 12.3536 3.64645Z"
                  fill="#344054"/>
            <path
              d="M6.25 8.04289L5.35355 7.14645C5.15829 6.95118 4.84171 6.95118 4.64645 7.14645C4.45118 7.34171 4.45118 7.65829 4.64645 7.85355L5.54289 8.75L6.25 8.04289Z"
              fill="#344054"/>
            <path
              d="M7.25 10.4571L8.14645 11.3536C8.24021 11.4473 8.36739 11.5 8.5 11.5C8.63261 11.5 8.75979 11.4473 8.85355 11.3536L15.8536 4.35355C16.0488 4.15829 16.0488 3.84171 15.8536 3.64645C15.6583 3.45118 15.3417 3.45118 15.1464 3.64645L8.5 10.2929L7.95711 9.75L7.25 10.4571Z"
              fill="#344054"/>
          </svg>
          <span>{{ plan.used_parts_limit }} {{ $t('menu.used') }}</span>
        </li>
        <li>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M12.3536 3.64645C12.5488 3.84171 12.5488 4.15829 12.3536 4.35355L5.35355 11.3536C5.25979 11.4473 5.13261 11.5 5 11.5C4.86739 11.5 4.74021 11.4473 4.64645 11.3536L1.14645 7.85355C0.951184 7.65829 0.951184 7.34171 1.14645 7.14645C1.34171 6.95118 1.65829 6.95118 1.85355 7.14645L5 10.2929L11.6464 3.64645C11.8417 3.45118 12.1583 3.45118 12.3536 3.64645Z"
                  fill="#344054"/>
            <path
              d="M6.25 8.04289L5.35355 7.14645C5.15829 6.95118 4.84171 6.95118 4.64645 7.14645C4.45118 7.34171 4.45118 7.65829 4.64645 7.85355L5.54289 8.75L6.25 8.04289Z"
              fill="#344054"/>
            <path
              d="M7.25 10.4571L8.14645 11.3536C8.24021 11.4473 8.36739 11.5 8.5 11.5C8.63261 11.5 8.75979 11.4473 8.85355 11.3536L15.8536 4.35355C16.0488 4.15829 16.0488 3.84171 15.8536 3.64645C15.6583 3.45118 15.3417 3.45118 15.1464 3.64645L8.5 10.2929L7.95711 9.75L7.25 10.4571Z"
              fill="#344054"/>
          </svg>
          <span>{{ plan.limit }} {{ $t('parts.title') }}</span>
        </li>
      </ul>

      <a
        class="selectPlan"
        :class="{'active':current}"
        href="#"
        @click.prevent="choosePackage(plan)"
      >{{ current ? $t('current_plan') : $t('select_plan') }}</a>
    </div>

    <el-dialog
      :title="$t('attention')"
      :visible.sync="dialogVisible"
      width="95%"
    >
      <div class="text-center"><img src="@/assets/img/attention.svg" alt=""></div>
      <div v-if="packageDown" class="warning_title">{{ $t('packages.down_title') }}</div>
      <div v-else class="warning_title">{{ $t('packages.up_title') }}</div>

      <p v-if="packageDown" class="warning_body">
        {{ $t('packages.down_text') }}
      </p>
      <p v-else class="warning_body">
        {{ $t('packages.up_text') }}
      </p>


      <el-alert
        :title="$t('packages.alert')"
        type="warning"
        :closable="false"
        show-icon/>

      <div slot="footer" class="dialog-footer text-center">
        <el-button :loading="loading" type="primary" @click="choosePackageApi(plan)">{{ $t('understood') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

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
  data () {
    return {
      loading: false,
      dialogVisible: false,
      packageDown: false
    }
  },
  computed: {
    ...mapGetters({
      packages: 'packages/packages',
      current_package: 'packages/current_package'
    })
  },
  methods: {
    ...mapActions({
      SELLER_PACKAGE_CHANGE: 'packages/SELLER_PACKAGE_CHANGE'
    }),
    async choosePackage (seller_package) {

      if (!this.current_package.seller_package_id || this.current_package.seller_package_id === seller_package.id) {
        await this.choosePackageApi(seller_package)
      } else {

        if (this.current_package.limit > seller_package.limit) {
          this.packageDown = true
        }
        this.dialogVisible = true
      }
    },
    async choosePackageApi (seller_package) {
      this.loading = true

      await this.SELLER_PACKAGE_CHANGE(seller_package.id)
        .then(response => {
          if (response.status) {
            window.location.href = response.redirect
          }
        })
        .finally(() => {
          this.loading = false
          this.dialogVisible = false
        })
    },
    getImgUrl (pet, exe = 'svg') {
      var images = require.context('../assets/img/packages', false, /\.png|.svg$/)
      return images('./' + pet.toLowerCase().trim() + '.' + exe)
    }
  }
}
</script>
<style lang="scss" scoped>
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
      display: flex;
      gap: 4px;
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
      padding: 4px 0 24px 0;
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
      margin-top: 0;
      font-size: $feature-size;
      list-style: none;
      padding-left: 0;
      color: #344054;
      line-height: 20px;
      font-weight: 400;

      li {
        padding: $plan-padding/2;
        display: flex;
        align-items: center;

        span {
          margin-left: 6px;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          text-align: center;
          color: #344054;
        }
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

.warning_title {
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  color: #344054;
}

.warning_body {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #98A2B3;
}

.el-alert {
  margin: 16px 0 0 0;
}

</style>
