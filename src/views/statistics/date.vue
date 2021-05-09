<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item
        :to="{ path: '/' }"
      >{{ $t('dashboard.title') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{ path: '/statistics/clicks' }"
      >{{ $t('statistics.title') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $route.params.date }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :lg="16">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <h2>{{ $t('date') }}: {{ $route.params.date }}</h2>
          </div>
          <el-table
            v-loading="listLoading"
            :data="statistics_by_date.data"
            border
            fit
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column prop="datetime" :label="$t('statistics.date')">
              <template slot-scope="{ $index, row }">
                {{ date(row.datetime) }}
              </template>
            </el-table-column>
            <el-table-column prop="user" :label="$t('statistics.user')" />
            <el-table-column prop="ip" label="IP" />
            <el-table-column
              prop="type_name"
              :label="$t('statistics.type_name')"
            />
            <el-table-column
              prop="type_cute_name"
              :label="$t('statistics.type_cute_name')"
            />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card v-loading="listLoading" shadow="always">
          <div slot="header" class="clearfix">
            <h2>{{ $t('info') }}:</h2>
          </div>
          <div>
            <strong>{{ $t('statistics.balance_before') }}</strong>: {{ statistics_by_date.balance_before }} usd
          </div>
          <div>
            <strong>{{ $t('statistics.price') }}</strong>: {{ statistics_by_date.price }}
          </div>
          <div>
            <strong>{{ $t('statistics.balance_after') }}</strong>: {{ statistics_by_date.balance_after }} usd
          </div>
          <div>
            <strong>{{ $t('statistics.total_clicks') }}</strong>: {{ statistics_by_date.total_clicks }}
          </div>
          <div>
            <strong>{{ $t('statistics.report_date') }}</strong>: {{ report_date }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
  name: 'Statistic',
  data() {
    return {
      listLoading: false,
      page: 1
    }
  },
  computed: {
    ...mapGetters({
      statistics_by_date: 'statistics/statistics_by_date'
    }),
    report_date() {
      return dayjs(this.statistics_by_date.report_date).format('YYYY-MM-DD')
    }
  },
  async beforeMount() {
    await this.getStatistics()
  },
  methods: {
    date(datetime) {
      return dayjs(datetime).format('DD MMM YYYY, hh:mm:ss')
    },
    async getStatistics() {
      this.listLoading = true
      await this.$store
        .dispatch('statistics/GET_STATISTICS_BY_DATE', {
          date: this.$route.params.date
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
