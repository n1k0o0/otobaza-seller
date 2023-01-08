<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
          $t('dashboard.title')
        }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('menu.used') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always">
      <div slot="header" class="clearfix">
        <h2>{{ $t('used.about_announcement') }}</h2>
        <div class="actions">
          <el-button @click="$router.push({name: 'Used'})" icon="el-icon-back">{{ $t('actions.back') }}</el-button>
          <el-button v-show="!edit" type="primary" @click="edit=true">{{ $t('actions.edit') }} <i
            class="el-icon-plus el-icon-plus"></i></el-button>
          <el-button v-show="edit" type="primary" @click="save">{{ $t('actions.save') }} <i
            class="el-icon-document-checked"></i></el-button>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.brand') }}</div>
          <el-select :disabled="!edit" v-model="product.car_manu_id" @change="manuChanged">
            <el-option
              v-for="item in manufacturers"
              :key="item.manuId"
              :label="item.manuName"
              :value="item.manuId"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.model') }}</div>
          <el-select v-model="product.car_mod_id" :disabled="!product.car_manu_id|| !edit" @change="modelChanged">
            <el-option
              v-for="item in manufacturer_models"
              :key="item.modId"
              :label="item.ModelName"
              :value="item.modId"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.name') }}</div>
          <el-input :disabled="!edit" v-model="product.title"></el-input>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.price') }}</div>
          <el-input :disabled="!edit" v-model="product.price" placeholder="Please input"
                    class="input-with-select">
            <el-select v-model="product.price_type" :disabled="!edit" slot="prepend"
                       :placeholder="$t('register.currency')" value="" class="w-15">
              <el-option
                v-for="item in currencies"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="sub-title">{{ $t('used.about') }}</div>
          <el-input
            :disabled="!edit"
            type="textarea"
            v-model="product.description"
            :rows="2"
            placeholder="Please input">
          </el-input>
        </el-col>

        <el-col :xs="24" :sm="24" :lg="24" class="mt-4">
          <div class="sub-title">{{ $t('used.images') }}</div>
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
            action="">
            <i class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.link || file.url" :alt="file.id">

              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="edit"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>

            </div>
          </el-upload>
        </el-col>
      </el-row>

    </el-card>


    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Used',
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      edit: false,
    }
  },
  computed: {
    ...mapGetters({
      product: 'used/product',
      manufacturers: 'catalog/manufacturers',
      manufacturer_models: 'catalog/manufacturer_models',
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
      GET_MANUFACTURERS: 'catalog/GET_MANUFACTURERS',
      GET_MANUFACTURER_MODELS: 'catalog/GET_MANUFACTURER_MODELS',
      DELETE_IMG: 'used/DELETE_IMG',
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
      await this.SAVE_PRODUCT()

      this.edit = false
    },
    manuChanged () {
      this.product.car_manu_name = this.manufacturers.find(el => el.manuId === this.product.car_manu_id).manuName
      this.product.car_mod_id = ''
      this.GET_MANUFACTURER_MODELS({ manufacturer: this.product.car_manu_id })
    },
    modelChanged () {
      this.product.car_mod_name = this.manufacturer_models.find(el => el.modId === this.product.car_mod_id).ModelName
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
</style>
