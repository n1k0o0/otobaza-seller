<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
        $t('dashboard.title')
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('orders.title') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always">
      <div slot="header" class="clearfix">
        <h2>{{ $t('orders.title') }}</h2>
      </div>
      <el-table
        v-loading="listLoading"
        :data="orders"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="order_id" :label="$t('orders.order_id')" />
        <el-table-column
          prop="order_number"
          :label="$t('orders.order_number')"
        />
        <el-table-column prop="customer" :label="$t('orders.customer')" />
        <el-table-column prop="product" :label="$t('orders.product')" />
        <el-table-column prop="price" :label="$t('orders.price')" />
        <el-table-column prop="created_at" :label="$t('orders.created_at')" />
        <el-table-column prop="status" :label="$t('orders.status')">
          <template slot-scope="{ row }">
            <el-select
              v-model="row.status.name"
              :placeholder="$t('orders.change_status')"
              size="mini"
              :loading="row.loading"
              @change="onChangeStatus(row)"
            >
              <el-option
                v-for="status in order_statuses"
                :key="status.name"
                :label="status.name"
                :selected="status.name === row.status.name"
                :value="status.name"
              />
            </el-select>
            <div>{{ row.status.created_at }}</div>
          </template>
        </el-table-column>
        <el-table-column label="" width="140">
          <template slot-scope="{ $index, row }">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-view"
              @click="show(row.order_id)"
            >{{ $t('detailed') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :page-size="+pagination.per_page"
        hide-on-single-page
        :total="pagination.total"
        @current-change="pageChange"
      />
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Orders',
  data() {
    return {
      listLoading: false,
      page: 1
    }
  },
  computed: {
    ...mapGetters({
      orders: 'orders/orders',
      pagination: 'orders/pagination',
      order_statuses: 'orders/order_statuses'
    })
  },
  async beforeMount() {
    await this.getOrders()
  },
  methods: {
    async getOrders() {
      this.listLoading = true
      await this.$store.dispatch('orders/GET_ORDER_STATUSES')
      await this.$store
        .dispatch('orders/GET_ORDERS', {
          page: this.page
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    async pageChange(page) {
      this.page = page
      await this.getOrders()
    },
    async onChangeStatus(row) {
      this.$set(row, 'loading', true)
      const id = this.order_statuses.find(
        order => order.name === row.status.name
      ).id
      const order_id = row.order_id
      await this.$store.dispatch('orders/SET_ORDER_STATUS', {
        id,
        order_id
      })
      this.$set(row, 'loading', false)
    },
    show(id) {
      this.$router.push({
        name: 'Order',
        params: {
          id
        }
      })
    }
  }
}
</script>
