<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
        $t('dashboard.title')
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('packages.title') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="16">
      <el-col>
        <el-card shadow="always">
          <div class="plan_title clearfix text-center">
            <h2>{{ $t('choose_package') }}</h2>
            <p>{{ $t('package_text') }}</p>
          </div>
          <PackagePlans/>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>
<script>
import PackagePlans from '@/components/PackagePlans'
import dayjs from 'dayjs'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Packages',
  components: { PackagePlans },
  data () {
    return {
      prolongPackageLoading: false
    }
  },
  computed: {
    ...mapGetters({
      packages: 'packages/packages',
      currencies: 'app/currencies',
      currency: 'app/currency',
      current_package: 'packages/current_package'
    }),
    expires() {
      return this.current_package?.expires || ''
    },
    limit() {
      return this.current_package?.limit || ''
    },
    currentPackage() {
      return (
        this.packages.find(
          item => item.id === this.current_package?.seller_package_id
        )?.name || ''
      )
    }
  },
  methods: {
    ...mapActions({
      PROLONG_PACKAGE: 'packages/PROLONG_PACKAGE'
    }),
    async prolongPackage() {
      this.prolongPackageLoading = true
      await this.PROLONG_PACKAGE()
        .then(response => {
          if (response.status) {
            window.location.href = response.redirect
          }
        })
        .finally(() => {
          this.prolongPackageLoading = false
        })
    },
    getDate (date) {
      return date ? dayjs(date).format('YYYY-MM-DD HH:mm') : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.plan_title {
  margin: 32px 0;

  h2 {
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    color: #344054;
  }

  p {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height, or 150% */

    text-align: center;
    /* Gray/500 */
    color: #667085;
  }
}
</style>
