<template>
  <div class="PageContainer">
    <div class="PageTitle">
      <h2>{{ $t('dashboard.title') }}</h2>
    </div>
    <el-row :gutter="16">
      <el-col :xs="24">
        <Badges/>
      </el-col>
      <el-col :xs="24">
        <div class="chart-wrapper">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong class="last_order_title">{{ $t('dashboard.last_orders') }}</strong>
            </div>
            <OrdersList/>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Badges from '@/components/Dashboard/Badges'
import BarCart from '@/components/Dashboard/BarCart'
import OrdersList from '@/components/Dashboard/OrdersList'

export default {
  name: 'Dashboard',
  components: { OrdersList, BarCart, Badges },
  async beforeMount () {
    await this.$store.dispatch('app/GET_DASHBOARD')
  }
}
</script>

<style lang="scss">
.last_order_title {
  font-weight: 400;
  font-size: 18px;
  line-height: 28px;
  color: #98A2B3;
}
</style>
