<template>
  <el-table v-loading="loading" :data="dashboard_orders">
    <el-table-column :label="$t('dashboard.order_number')" min-width="100">
      <template slot-scope="scope">
        {{ scope.row.order_number }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('dashboard.customer')" min-width="195">
      <template slot-scope="scope">
        {{ scope.row.customer }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('dashboard.product')" min-width="195">
      <template slot-scope="scope">
        {{ scope.row.product }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('dashboard.price')" min-width="195">
      <template slot-scope="scope"> {{ scope.row.price }} </template>
    </el-table-column>
    <el-table-column :label="$t('dashboard.created_at')" min-width="195">
      <template slot-scope="{ row }">
        {{ row.created_at }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('dashboard.status')" width="150">
      <template slot-scope="{ row }">
        <el-tag :type="row.status.name | statusFilter">
          {{ row.status.name }}
        </el-tag>
        <div>{{ row.status.created_at }}</div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'OrdersList',
  filters: {
    statusFilter(status) {
      const statusMap = {
        Finished: 'success',
        Pending: 'info',
        Disputed: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      dashboard_orders: 'app/dashboard_orders'
    })
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      await this.$store
        .dispatch('app/GET_DASHBOARD_ORDERS', {
          limit: 5
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
