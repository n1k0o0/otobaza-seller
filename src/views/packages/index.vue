<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
        $t('dashboard.title')
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('packages.title') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="16">
      <el-col :xs="24" :sm="16" :lg="18">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <h2>{{ $t('choose_package') }}:</h2>
          </div>
          <PackagePlans />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="6">
        <el-card
          v-loading="prolongPackageLoading || !currentPackage"
          shadow="always"
        >
          <div slot="header" class="clearfix">
            <h2>{{ $t('your_current_package') }}:</h2>
          </div>
          <div class="mb-1">
            {{ $t('package') }}: <strong>{{ currentPackage }}</strong>
          </div>
          <div class="mb-1">
            {{ $t('limit') }}: <strong>{{ limit }}</strong>
          </div>
          <div class="mb-1">{{ $t('expires') }}: {{ getDate(expires) }}</div>
          <div>
            <el-button
              type="secondary"
              @click="prolongPackage"
            ><i class="el-icon-refresh" /> {{ $t('refresh_plan') }}</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import PackagePlans from '@/components/PackagePlans'
import dayjs from 'dayjs'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Packages',
  components: { PackagePlans },
  data() {
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
    getDate(date) {
      return date ? dayjs(date).format('YYYY-MM-DD HH:mm') : ''
    }
  }
}
</script>
