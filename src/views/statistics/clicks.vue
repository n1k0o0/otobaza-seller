<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
        $t('dashboard.title')
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('statistics.title') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always">
      <div slot="header" class="clearfix">
        <h2>{{ $t('statistics.title') }}</h2>
      </div>
      <el-table
        v-loading="listLoading"
        :data="statistics"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="date" :label="$t('statistics.date')">
          <template slot-scope="{ row }">
            {{ getDate(row.date) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="view_total"
          :label="$t('statistics.view_total')"
        />
        <el-table-column
          prop="calculation_had_run"
          :label="$t('statistics.calculation_had_run')"
        />
        <el-table-column label="" width="140">
          <template slot-scope="{ $index, row }">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-view"
              @click="show(row.date)"
            >{{ $t('detailed') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :page-size="pagination.per_page"
        hide-on-single-page
        :total="pagination.total"
        @current-change="pageChange"
      />
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
export default {
  name: 'Statistics',
  data() {
    return {
      listLoading: false,
      page: 1
    }
  },
  computed: {
    ...mapGetters({
      statistics: 'statistics/statistics',
      pagination: 'statistics/pagination'
    })
  },
  async beforeMount() {
    await this.getStatistics()
  },
  methods: {
    show(date) {
      this.$router.push({
        name: 'StatisticByDate',
        params: {
          date: dayjs(date).format('YYYY-MM-DD')
        }
      })
    },
    getDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    async getStatistics() {
      this.listLoading = true
      await this.$store
        .dispatch('statistics/GET_STATISTICS', {
          page: this.page
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    async pageChange(page) {
      this.page = page
      await this.getStatistics()
    }
  }
}
</script>
