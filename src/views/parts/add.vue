<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
        $t('dashboard.title')
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('parts.add') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always">
      <div slot="header" class="d-flex align-items-center clearfix">
        <h2>{{ $t('parts.add') }}</h2>
        <el-button
          v-if="excel_file"
          icon="el-icon-download"
          type="primary"
          style="margin-left: auto"
          size="small"
          @click.prevent="downloadExcel"
        >{{ $t('parts.download_excel') }}</el-button>
      </div>

      <p>{{ $t('parts.select_excel') }}</p>
      <div class="excelUpload">
        <el-upload
          action="#"
          class="upload-demo"
          :on-change="handleChange"
          :auto-upload="false"
          :limit="1"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :file-list="fileList"
        >
          <el-button size="small" type="primary" :loading="loading">{{
            $t('parts.select_file')
          }}</el-button>
        </el-upload>
      </div>
      <el-table
        v-if="excel_parts.length"
        v-loading="loadingTable"
        :data="excel_parts"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="code" :label="$t('parts.code')">
          <template slot-scope="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.code" size="mini" />
            </template>
            <template v-else>
              {{ row.code }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="oem" :label="$t('parts.oem')">
          <template slot-scope="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.oem" size="mini" />
            </template>
            <template v-else>
              {{ row.oem }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="manufacturer" :label="$t('parts.manufacturer')">
          <template slot-scope="{ row }">
            <template v-if="row.editable">
              <el-select
                v-model="row.manufacturer"
                size="mini"
                filterable
                :placeholder="$t('parts.select_manufacturer')"
              >
                <el-option
                  v-for="(item, index) in part_manufacturers"
                  :key="item.value + index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
            <template v-else>
              {{ row.manufacturer }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="price" :label="$t('parts.price')">
          <template slot-scope="{ row }">
            <template v-if="row.editable">
              <el-input-number v-model="row.price" size="mini" />
            </template>
            <template v-else>
              {{ row.price }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="description" :label="$t('parts.description')">
          <template slot-scope="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.description" size="mini" />
            </template>
            <template v-else>
              {{ row.description }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="product_type" :label="$t('parts.product_type')">
          <template slot-scope="{ row }">
            <template v-if="row.editable">
              <el-select v-model="row.product_type" size="mini">
                <el-option
                  v-for="item in productTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
            <template v-else>
              {{ row.product_type === 1 ? $t('yes') : $t('no') }}
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
        </el-table-column>
      </el-table>
      <el-divider v-if="excel_parts.length" />
      <el-button
        v-if="excel_parts.length"
        type="primary"
        icon="el-icon-refresh"
        :loading="loadingTable"
        :disabled="loadingTable"
        @click="check"
      >{{ $t('parts.check') }}</el-button>
      <el-button
        v-if="canSubmit && isChecked"
        type="primary"
        icon="el-icon-plus"
        :loading="loadingTable"
        :disabled="loadingTable"
        @click="submit"
      >{{ $t('parts.add_parts') }}</el-button>
    </el-card>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'AddParts',
  data() {
    return {
      excel_file: '',
      formData: new FormData(),
      fileList: [],
      loading: false,
      loadingTable: false,
      checked: false
    }
  },
  computed: {
    ...mapGetters({
      excel_parts: 'parts/excel_parts',
      currency: 'app/currency',
      part_manufacturers: 'parts/part_manufacturers'
    }),
    isChecked() {
      return this.checked
    },
    canSubmit() {
      const hasErrors = this.excel_parts.filter(item => item.status === false)
        .length
      return this.excel_parts.length && !hasErrors
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
    await this.GET_PART_MANUFACTURERS()
    this.excel_file = await this.GET_EXCEL_FILE()
    this.CLEAR_EXCEL_DATA()
  },
  methods: {
    ...mapActions({
      CHECK_PARTS: 'parts/CHECK_PARTS',
      ADD_PARTS: 'parts/ADD_PARTS',
      GET_PART_MANUFACTURERS: 'parts/GET_PART_MANUFACTURERS',
      GET_EXCEL_FILE: 'parts/GET_EXCEL_FILE'
    }),
    ...mapMutations({
      CLEAR_EXCEL_DATA: 'parts/CLEAR_EXCEL_DATA'
    }),
    async check() {
      this.loadingTable = true
      await this.CHECK_PARTS({
        parts: this.excel_parts
      })
      this.loadingTable = false
      this.checked = true
    },
    edit(row) {
      this.$set(row, 'editable', !row.editable)
    },
    save(row) {
      this.$set(row, 'editable', !row.editable)
    },
    remove(row) {
      const index = this.excel_parts.indexOf(row)
      this.excel_parts.splice(index, 1)
    },
    async submit() {
      this.loadingTable = true
      const parts = this.excel_parts.map(part => {
        return {
          part_number: part.code,
          oem: part.oem,
          manufacturer: part.manufacturer,
          description: part.description,
          product_type: part.product_type,
          price: part.price,
          price_type: this.currency,
          status_id: 1
        }
      })
      await this.ADD_PARTS({
        data: parts
      })
        .then(response => {
          this.$message({
            message: response?.data?.message || 'Success',
            type: 'success'
          })
          this.CLEAR_EXCEL_DATA()
          setTimeout(() => {
            this.$router.push({
              name: 'Parts'
            })
          }, 3000)
        })
        .finally(() => {
          this.loadingTable = false
        })
    },
    tableRowClassName({ row }) {
      if (Object.keys(row).includes('status')) {
        if (row?.status) {
          return 'success'
        } else {
          return 'danger'
        }
      }
      return ''
    },
    async handleChange(file, fileList) {
      this.loading = true
      this.fileList = fileList

      this.fileList.map(image => {
        this.formData.append('excel_file', image.raw)
      })

      await this.$store.dispatch('parts/UPLOAD_EXCEL_FILE', {
        formData: this.formData
      })
      this.loading = false
    },
    downloadExcel() {
      const url = this.excel_file
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'excel_name.xlsx')
      document.body.appendChild(link)
      link.click()
    }
  }
}
</script>
<style lang="scss">
.excelUpload {
  max-width: 300px;
  margin-bottom: 1rem;
}
.el-table .danger {
  background: #fde6e6;
}
.el-table .success {
  background: #f0f9eb;
}
</style>
