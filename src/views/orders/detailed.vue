<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
        $t('dashboard.title')
      }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/orders' }">{{
        $t('orders.title')
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ orderNumber }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="16">
      <el-col :xs="24" :sm="16" :lg="18">
        <el-card v-loading="loading" shadow="always">
          <div slot="header" class="clearfix">
            <h2>{{ $t('orders.order') }}: {{ orderNumber }}</h2>
          </div>
          <section v-if="!loading">
            <div>
              <h3>{{ $t('orders.order_details') }}:</h3>
              <p>
                {{ $t('orders.order_number') }}:
                <strong>{{ order.order_details.order_number }}</strong>
              </p>
              <p>
                {{ $t('orders.order_date') }}:
                <strong>{{ order.order_details.order_date }}</strong>
              </p>
              <p>
                {{ $t('orders.delivery_method') }}:
                <strong>{{ order.order_details.delivery_method }}</strong>
              </p>
              <p>
                {{ $t('orders.delivery_address') }}:
                <strong>{{ order.order_details.delivery_address }}</strong>
              </p>
              <p>
                {{ $t('orders.has_geo') }}:
                <strong>{{
                  order.order_details.has_geo ? $t('yes') : $t('no')
                }}</strong>
              </p>
            </div>
            <el-divider />
            <div>
              <h3>{{ $t('orders.customer_details') }}:</h3>
              <p>
                {{ $t('orders.contact_name') }}:
                <strong>{{ order.customer_details.contact_name }}</strong>
              </p>
              <p>
                {{ $t('orders.contact_email') }}:
                <strong>{{ order.customer_details.contact_email }}</strong>
              </p>
              <p>
                {{ $t('orders.contact_phone') }}:
                <strong>{{ order.customer_details.contact_phone }}</strong>
              </p>
            </div>
            <el-divider />
            <div>
              <h3>{{ $t('orders.product') }}:</h3>
              <p>
                {{ $t('orders.product_name') }}:
                <strong>{{ order.product.product_name }}</strong>
              </p>
              <p>
                {{ $t('orders.quantity') }}:
                <strong>{{ order.product.quantity }}</strong>
              </p>
              <p>
                {{ $t('orders.price') }}:
                <strong>{{ order.product.unit_price }}
                  {{ order.product.currency }}</strong>
              </p>
              <p>
                {{ $t('orders.total_price') }}:
                <strong>{{ order.product.total }}
                  {{ order.product.currency }}</strong>
              </p>
            </div>
          </section>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="6">
        <el-card v-loading="loading" shadow="always">
          <div slot="header" class="clearfix">
            <h2>{{ $t('orders.statuses') }}</h2>
          </div>
          <div>
            <el-timeline style="margin:0;padding:0;" reverse>
              <el-timeline-item
                v-for="(status, index) in order.statuses"
                :key="index"
                :timestamp="status.created_at"
              >
                {{ status.activity }} : {{ status.name }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Order',
  data() {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      order: 'orders/order'
    }),
    orderNumber() {
      return this.order?.order_details?.order_number || ''
    }
  },
  async beforeMount() {
    this.loading = true
    await this.getOrder()
    this.loading = false
  },
  methods: {
    async getOrder() {
      await this.$store.dispatch('orders/GET_ORDER', {
        id: this.$route.params.id
      })
    }
  }
}
</script>
