<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
          $t('dashboard.title')
        }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('dismantles.title') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always">
      <template slot="header">
        <h2>{{ $t('dismantles.title') }}</h2>
        <router-link to="/dismantles/add" class="Operation">
          <el-button size="mini" type="primary" icon="el-icon-plus">{{
              $t('dismantles.add')
            }}
          </el-button>
        </router-link>
      </template>
      <el-table
        v-loading="listLoading"
        :data="dismantles"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          :label="$t('dismantles.name')"
          width="300"
        />
        <el-table-column
          prop="description"
          :label="$t('dismantles.description')"
          width="300"
        />
        <el-table-column prop="type" :label="$t('dismantles.type')" />
        <el-table-column prop="color" :label="$t('dismantles.color')" />
        <el-table-column prop="year" :label="$t('dismantles.year')" />
        <el-table-column
          prop="engine"
          :label="$t('dismantles.engine')"
          min-width="100"
        />
        <el-table-column
          prop="transmission"
          :label="$t('dismantles.transmission')"
          min-width="120"
        />
        <el-table-column prop="milage" :label="$t('dismantles.milage')" />
        <el-table-column label="" width="250">
          <template slot-scope="{ $index, row }">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="edit(row.id)"
            >{{ $t('edit') }}
            </el-button>
            <el-popconfirm
              class="ml-1"
              :title="$t('dismantles.confirm_delete')"
              :confirm-button-text="$t('yes')"
              :cancel-button-text="$t('no')"
              @onConfirm="handleDelete($index, row)"
            >
              <el-button
                slot="reference"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                :loading="row.loading"
              >{{ $t('delete') }}
              </el-button>
            </el-popconfirm>
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

export default {
  name: 'Dashboard',
  data() {
    return {
      listLoading: false,
      page: 1
    }
  },
  computed: {
    ...mapGetters({
      pagination: 'dismantles/pagination',
      dismantles: 'dismantles/dismantles'
    })
  },
  async beforeMount() {
    await this.getDismantles()
  },
  methods: {
    edit(id) {
      this.$router.push({
        name: 'DismantlesEdit',
        params: {
          id
        }
      })
    },
    async getDismantles() {
      this.listLoading = true
      await this.$store
        .dispatch('dismantles/GET_DISMANTLES', {
          page: this.page
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    async handleDelete(index, row) {
      this.$set(row, 'loading', true)
      await this.$store.dispatch('dismantles/DELETE_DISMANTLE', {
        id: row.id
      })
    },
    async pageChange(page) {
      this.page = page
      await this.getDismantles()
    }
  }
}
</script>

<style lang="scss" scoped></style>
