<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
        $t('dashboard.title')
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('parts.title') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always">
      <div slot="header" class="clearfix">
        <h2>{{ $t('parts.title') }}</h2>
      </div>
      <h3>{{ $t('select_file') }}:</h3>
      <el-select
        v-model="selectedDataFile"
        :placeholder="$t('select_file')"
        @change="onSelectedDataFile"
      >
        <el-option
          v-for="item in data_files"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        v-if="selectedDataFile"
        type="danger"
        style="margin-left:10px;"
        icon="el-icon-delete"
        :loading="loadingTable"
        @click="removeDataFile"
      >{{ $t('parts.remove_selected_file') }}</el-button>
      <template v-if="products.length && selectedDataFile">
        <el-divider />
        <h4>{{ $t('parts.parts_count') }}: {{ products_pagination.total }}</h4>
        <el-table
          v-loading="loadingTable"
          :data="products"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column prop="part_number" :label="$t('parts.part_number')">
            <template slot-scope="{ row }">
              {{ row.part_number }}
            </template>
          </el-table-column>
          <el-table-column prop="oem" :label="$t('parts.oem')">
            <template slot-scope="{ row }">
              <template v-if="row.editable">
                <el-input v-model="editing.oem" size="mini" />
              </template>
              <template v-else>
                {{ row.oem }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="manufacturer"
            :label="$t('parts.manufacturer')"
          >
            <template slot-scope="{ row }">
              {{ row.manufacturer }}
            </template>
          </el-table-column>
          <el-table-column prop="price" :label="$t('parts.price')">
            <template slot-scope="{ row }">
              <template v-if="row.editable">
                <el-input-number v-model="editing.price" size="mini" />
              </template>
              <template v-else>
                {{ row.price }} {{ row.currency.currency_code }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="description" :label="$t('parts.description')">
            <template slot-scope="{ row }">
              <template v-if="row.editable">
                <el-input v-model="editing.description" size="mini" />
              </template>
              <template v-else>
                {{ row.description }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="type.id" :label="$t('parts.product_type')">
            <template slot-scope="{ row }">
              <template v-if="row.editable">
                <el-select v-model="editing.type.id" size="mini">
                  <el-option
                    v-for="item in productTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
              <template v-else>
                {{ row.type.id === 1 ? $t('yes') : $t('no') }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="actions" width="130">
            <template slot-scope="{ row }">
              <template v-if="!row.editable">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="edit(row)"
                />
              </template>
              <template v-else>
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-check"
                  @click="save(row)"
                />
              </template>

              <template v-if="row.editable">
                <el-button
                  type="secondary"
                  size="mini"
                  icon="el-icon-close"
                  class="ml-1"
                  @click="cancel(row)"
                />
              </template>
              <template v-else>
                <el-popconfirm
                  :title="$t('parts.confirm_delete')"
                  :confirm-button-text="$t('yes')"
                  :cancel-button-text="$t('no')"
                  icon-color="red"
                  icon="el-icon-info"
                  @onConfirm="remove(row)"
                >
                  <el-button
                    slot="reference"
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    class="ml-1"
                  />
                </el-popconfirm>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          :page-size="+products_pagination.per_page"
          hide-on-single-page
          :total="products_pagination.total"
          @current-change="pageChange"
        />
      </template>
    </el-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Parts',
  data() {
    return {
      page: 1,
      loadingTable: false,
      selectedDataFile: '',
      editing: null
    }
  },
  computed: {
    ...mapGetters({
      products: 'parts/products',
      products_pagination: 'parts/products_pagination',
      part_manufacturers: 'parts/part_manufacturers'
    }),
    data_files() {
      return this.$store.getters['parts/uploaded_data_files'].map(item => {
        return {
          value: item.data_file,
          label: item.data_file
        }
      })
    },
    productTypeOptions() {
      return [
        {
          value: 1,
          label: this.$t('yes')
        },
        {
          value: 2,
          label: this.$t('no')
        }
      ]
    }
  },
  async beforeMount() {
    await this.GET_UPLOADED_DATA_FILES()
    await this.GET_PART_MANUFACTURERS()
  },
  methods: {
    ...mapActions({
      GET_UPLOADED_DATA_FILES: 'parts/GET_UPLOADED_DATA_FILES',
      GET_PRODUCTS_BY_DATA_FILE: 'parts/GET_PRODUCTS_BY_DATA_FILE',
      GET_PART_MANUFACTURERS: 'parts/GET_PART_MANUFACTURERS',
      UPDATE_PRODUCT: 'parts/UPDATE_PRODUCT',
      REMOVE_DATA_FILE: 'parts/REMOVE_DATA_FILE',
      DELETE_PRODUCT: 'parts/DELETE_PRODUCT'
    }),
    async removeDataFile() {
      this.loadingTable = true
      await this.REMOVE_DATA_FILE({
        datafile: this.selectedDataFile
      })
      await this.GET_UPLOADED_DATA_FILES()
      this.selectedDataFile = null
      this.loadingTable = false
    },
    async onSelectedDataFile() {
      this.loadingTable = true
      await this.getProducts()
      this.loadingTable = false
    },
    async pageChange(page) {
      this.page = page
      await this.getProducts()
    },
    async getProducts() {
      this.loadingTable = true
      await this.$store.dispatch('orders/GET_ORDER_STATUSES')
      await this.GET_PRODUCTS_BY_DATA_FILE({
        page: this.page,
        datafile: this.selectedDataFile
      })
      this.loadingTable = false
    },
    edit(row) {
      this.editing = JSON.parse(JSON.stringify(row))
      this.$set(row, 'editable', !row.editable)
    },
    async save(row) {
      const {
        oem,
        description,
        type: { id: product_type },
        price,
        currency
      } = this.editing

      const product = {
        oem,
        description,
        product_type,
        price,
        price_type: currency.id
      }

      const id = row.id
      this.loadingTable = true
      await this.UPDATE_PRODUCT({
        id,
        product
      })
        .then(async() => {
          await this.getProducts()
        })
        .finally(() => {
          this.loadingTable = false
        })
    },
    cancel(row) {
      this.editing = null
      this.$set(row, 'editable', false)
    },
    async remove(row) {
      this.loadingTable = true
      await this.DELETE_PRODUCT({
        ids: [{ id: row.id }]
      })
      if (this.selectedDataFile) {
        await this.GET_PRODUCTS_BY_DATA_FILE({
          page: this.page,
          datafile: this.selectedDataFile
        })
      }
      this.loadingTable = false
    }
  }
}
</script>
