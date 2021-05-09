<template>
  <div class="PageContainer">
    <div class="PageTitle">
      <h2>{{ $t('dashboard.title') }}</h2>
    </div>
    <el-row :gutter="16">
      <el-col :xs="24" :sm="18" :lg="16">
        <div class="chart-wrapper">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>{{ $t('dashboard.statistics') }}</strong>
            </div>
            <BarCart />
          </el-card>
        </div>
      </el-col>
      <el-col :xs="24" :sm="6" :lg="8">
        <Badges />
      </el-col>
      <el-col :xs="24">
        <div class="chart-wrapper">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <strong>{{ $t('dashboard.last_orders') }}</strong>
            </div>
            <OrdersList />
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
  async beforeMount() {
    await this.$store.dispatch('app/GET_DASHBOARD')
  }
}
</script>
