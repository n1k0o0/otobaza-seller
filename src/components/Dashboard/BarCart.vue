<template>
  <div
    v-loading="loading"
    :class="className"
    :style="{ height: height, width: width }"
  />
</template>

<script>
import dayjs from 'dayjs'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { mapGetters } from 'vuex'
const animationDuration = 2000

export default {
  name: 'BarCart',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '265px'
    }
  },
  data() {
    return {
      chart: null,
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      dashboard: 'app/dashboard'
    }),
    activities() {
      return this.dashboard?.view_activities || []
    },
    dates() {
      return this.activities.map(item => {
        return dayjs(item.date).format('YYYY-MM-DD')
      })
    },
    views() {
      return this.activities.map(item => {
        return item.view_total
      })
    },
    prices() {
      return this.activities.map(item => {
        return item.calculated_price
      })
    }
  },
  mounted() {
    this.loading = true
    setTimeout(() => {
      this.initChart()
      this.loading = false
    }, 1000)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.dates,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: this.$t('dashboard.views'),
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: this.views,
            animationDuration
          },
          {
            name: this.$t('dashboard.price'),
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: this.prices,
            animationDuration
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss">
.chart-wrapper {
  margin-bottom: 16px;
}
</style>
