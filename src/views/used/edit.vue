<template>
  <div class="PageContainer">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="Breadcrumbs"
    >
      <el-breadcrumb-item :to="{ path: '/' }">
        {{
          $t('dashboard.title')
        }}
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/used' }">
        {{ $t('menu.used') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ product.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always">
      <template slot="header">
        <div class="left">
          <svg
            icon="el-icon-back"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            @click="$router.push({name: 'Used'})"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="#344054"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <h2>{{ $t('used.about_announcement') }} <span> #{{ product.id }}</span></h2>
        </div>

        <div class="actions">
          <el-button
            v-show="!edit && !product.is_active"
            type="success"
            @click="changeStatus(1)"
          >
            {{ $t('actions.activate') }}
            <i class="el-icon-switch-button" />
          </el-button>
          <el-button
            v-show="!edit && product.is_active"
            @click="changeStatus(0)"
          >
            {{ $t('actions.deactivate') }}
            <i class="el-icon-switch-button" />
          </el-button>

          <el-button
            v-show="!edit"
            type="primary"
            @click="edit=true"
          >
            {{ $t('actions.edit') }} <i
              class="el-icon-plus el-icon-plus"
            />
          </el-button>
          <el-button
            v-show="edit"
            :loading="loading"
            type="primary"
            @click="save"
          >
            {{ $t('actions.save') }} <i
              class="el-icon-document-checked"
            />
          </el-button>
        </div>
      </template>

      <el-row
        :gutter="20"
        class="tariffs"
      >
        <el-col
          :xs="24"
          :sm="24"
          :lg="8"
        >
          <div
            class="tariffs_item"
            @click="$router.push({name: 'ForwardUsed',params:{id:product.id}})"
          >
            <img
              src="@/assets/img/forward.png"
              alt=""
            >
            {{ $t('actions.tariff_forward') }}
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="8"
        >
          <div
            class="tariffs_item"
            @click="$router.push({name: 'VIPUsed',params:{id:product.id}})"
          >
            <img
              src="@/assets/img/vip.png"
              alt=""
            >
            {{ $t('actions.tariff_vip') }}
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="8"
        >
          <div
            class="tariffs_item"
            @click="$router.push({name: 'SpecialUsed',params:{id:product.id}})"
          >
            <img
              src="@/assets/img/special.png"
              alt=""
            >
            {{ $t('actions.tariff_special') }}
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col
          :xs="24"
          :sm="24"
          :lg="12"
        >
          <div class="sub-title">
            {{ $t('used.brand') }}
          </div>
          <el-select
            v-model="product.car_manu_id"
            :disabled="!edit"
            @change="manuChanged"
          >
            <el-option
              v-for="item in manufacturers"
              :key="item.manuId"
              :label="item.manuName"
              :value="item.manuId"
            />
          </el-select>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="12"
        >
          <div class="sub-title">
            {{ $t('used.model') }}
          </div>
          <el-select
            v-model="product.car_mod_id"
            :disabled="!product.car_manu_id|| !edit"
            @change="modelChanged"
          >
            <el-option
              v-for="item in manufacturer_models"
              :key="item.modelId"
              :label="item.modelname"
              :value="item.modelId"
            />
          </el-select>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="12"
        >
          <div class="sub-title">
            {{ $t('used.name') }}
          </div>
          <el-input
            v-model="product.title"
            :disabled="!edit"
          />
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="12"
        >
          <div class="sub-title">
            {{ $t('used.price') }}
          </div>
          <el-input
            v-model="product.price"
            :disabled="!edit"
            placeholder="Please input"
            class="input-with-select"
          >
            <el-select
              slot="prepend"
              v-model="product.price_type"
              :disabled="!edit"
              :placeholder="$t('register.currency')"
              value=""
              class="w-15"
            >
              <el-option
                v-for="item in currencies"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-input>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="24"
        >
          <div class="sub-title">
            {{ $t('used.about') }}
          </div>
          <el-input
            v-model="product.description"
            :disabled="!edit"
            type="textarea"
            :rows="2"
            placeholder="Please input"
          />
        </el-col>

        <el-col
          :xs="24"
          :sm="24"
          :lg="24"
          class="mt-4"
        >
          <div class="sub-title">
            {{ $t('used.images') }}
          </div>
          <el-upload
            :file-list="product.images"
            :disabled="!edit"
            list-type="picture-card"
            multiple
            :auto-upload="false"
            :on-preview="handlePictureCardPreview"
            :before-remove="handleRemove"
            :on-change="handlePictureChanged"
            accept=".png,.jpg,.jpeg,.gif"
            action=""
          >
            <i class="el-icon-plus" />
            <div
              slot="file"
              slot-scope="{file}"
              class="h-100"
            >
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.link || file.url"
                :alt="file.id"
              >

              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in" />
                </span>
                <span
                  v-if="edit"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete" />
                </span>
              </span>
            </div>
          </el-upload>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog :visible.sync="dialogVisible">
      <img
        width="100%"
        :src="dialogImageUrl"
        alt=""
      >
    </el-dialog>

    <el-dialog :visible.sync="tariffModal">
      <template #title>
        <h2>{{ tariffModalHeader }}</h2>
      </template>
      <h3> {{ $t('used.tariff_text') }} </h3>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Used',
  data () {
    return {
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      edit: false,
      tariffModal: false,
      tariffModalHeader: ''
    }
  },
  computed: {
    ...mapGetters({
      product: 'used/product',
      manufacturers: 'used/brands',
      manufacturer_models: 'used/models',
      currencies: 'app/currencies',
    }),
  },
  async beforeMount () {
    await this.GET_PRODUCT(this.$route.params.id)
    await this.GET_MANUFACTURERS()
    await this.GET_MANUFACTURER_MODELS({ manufacturer: this.product.car_manu_id })
  },
  methods: {
    ...mapActions({
      GET_PRODUCT: 'used/GET_PRODUCT',
      SAVE_PRODUCT: 'used/SAVE_PRODUCT',
      GET_MANUFACTURERS: 'used/GET_BRANDS',
      GET_MANUFACTURER_MODELS: 'used/GET_MODELS',
      DELETE_IMG: 'used/DELETE_IMG',
      CHANGE_STATUS: 'used/CHANGE_STATUS',
    }),
    async handleRemove (file) {
      if (file.id) {
        this.$confirm(this.$t('remove_question')).then(async () => {
          await this.DELETE_IMG(file.id)
          this.product.images = this.product.images.filter(el => el.id !== file.id)
          this.$message({
            type: 'success',
            message: 'Delete completed'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          })
          return false
        })
      }
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.link
      this.dialogVisible = true
    },
    handlePictureChanged (file, fileList) {
      this.product.images = fileList
    },
    async save () {
      this.loading = true
      try {
        await this.SAVE_PRODUCT()

        this.edit = false
        this.$message({
          message: 'Success.',
          type: 'success'
        })
      } finally {
        this.loading = false
      }

    },
    manuChanged () {
      this.product.car_manu_name = this.manufacturers.find(el => el.manuId === this.product.car_manu_id).manuName
      this.product.car_mod_id = ''
      this.GET_MANUFACTURER_MODELS({ manufacturer: this.product.car_manu_id })
    },
    modelChanged () {
      this.product.car_mod_name = this.manufacturer_models.find(el => el.modelId === this.product.car_mod_id).modelname
    },
    changeTariff (title) {
      this.tariffModalHeader = title
      this.tariffModal = true
    },
    async changeStatus (status) {
      await this.CHANGE_STATUS({ id: this.product.id, status: status })
      this.$message({
        message: 'Success.',
        type: 'success'
      })
      this.product.is_active = status
    }
  },
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

.sub-title {
  padding: 16px 0 6px 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #344054;
}

.tariffs {
  &_item {
    display: flex;
    justify-content: center;
    align-items: center;

    color: #344054;
    border: 1px solid #F2F4F7;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    cursor: pointer;
    transition: background-color .3s linear;

    &:hover {
      background-color: #F2F4F7;
    }
  }
}
</style>
