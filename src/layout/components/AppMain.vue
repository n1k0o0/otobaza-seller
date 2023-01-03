<template>
  <section class="app-main">
    <el-alert
      v-if="is_products_invisible"
      :title="$t('information')"
      type="warning"
      show-icon
      :closable="false"
    >
      <div v-html="products_invisible_msg" />
    </el-alert>
    <el-alert
      v-if="is_balance_overed"
      :title="$t('information')"
      type="warning"
      show-icon
      :closable="false"
    >
      <div v-html="balance_overed_msg" />
    </el-alert>
    <el-alert
      v-if="is_package_expired"
      :title="$t('information')"
      type="warning"
      show-icon
      :closable="false"
    >
      <div v-html="package_expired_msg" />
    </el-alert>
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppMain',
  computed: {
    ...mapGetters({
      account_status: 'app/account_status'
    }),
    key() {
      return this.$route.path
    },
    is_products_invisible() {
      return this.account_status.products_invisible
    },
    products_invisible_msg() {
      return this.account_status.products_invisible_msg
    },
    is_balance_overed() {
      return this.account_status.balance_overed
    },
    balance_overed_msg() {
      return this.account_status.balance_overed_msg
    },
    is_package_expired() {
      return this.account_status.package_expired
    },
    package_expired_msg() {
      return this.account_status.package_expired_msg
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/styles/variables.scss";

.app-main {
  /*50 = navbar  */
  min-height: calc(100vh);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: $headerHeight + 24px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
