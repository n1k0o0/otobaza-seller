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
      <template slot="header">
        <h2>{{ $t('used.about_announcement') }}</h2>
        <div class="actions">
          <el-button icon="el-icon-back" @click="$router.push({name: 'Used'})">{{ $t('actions.back') }}</el-button>
          <el-button type="primary" @click="save">{{ $t('actions.add') }} <i class="el-icon-plus el-icon-plus"/>
          </el-button>
        </div>
      </template>

      <el-row :gutter="16">
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.brand') }}</div>
          <el-select v-model="form.car_manu_id" @change="manuChanged">
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
          <el-select v-model="form.car_mod_id" :disabled="!form.car_manu_id" @change="modelChanged">
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
          <el-input v-model="form.title"></el-input>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.price') }}</div>
          <el-input v-model="form.price" placeholder="Please input" class="input-with-select">
            <el-select v-model="form.price_type" slot="prepend" :placeholder="$t('register.currency')" value=""
                       class="w-15">
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
            type="textarea"
            v-model="form.description"
            :rows="2"
            placeholder="Please input"
          />
        </el-col>

        <el-col :xs="24" :sm="24" :lg="24" class="mt-4">
          <div class="sub-title">{{ $t('used.images') }}</div>
          <el-upload
            v-model="form.images"
            list-type="picture-card"
            multiple
            accept=".png,.jpg,.jpeg,.gif"
            :auto-upload="false"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handlePictureChange"
            action="">
            <i class="el-icon-plus"></i>
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
      form: {
        car_manu_id: '',
        car_manu_name: '',
        car_mod_id: '',
        car_mod_name: '',
        title: '',
        price: '',
        price_type: '',
        description: '',
        images: []
      }
    }
  },
  async beforeMount () {
    await this.GET_MANUFACTURERS()
  },
  computed: {
    ...mapGetters({
      products: 'parts/products',
      manufacturers: 'catalog/manufacturers',
      manufacturer_models: 'catalog/manufacturer_models',
      currencies: 'app/currencies',
    }),
  },
  methods: {
    ...mapActions({
      GET_MANUFACTURERS: 'catalog/GET_MANUFACTURERS',
      CREATE_PRODUCT: 'used/CREATE_PRODUCT',
      GET_MANUFACTURER_MODELS: 'catalog/GET_MANUFACTURER_MODELS',
    }),
    handleRemove (file, fileList) {
      this.form.images = fileList
    },
    handlePictureChange (file, fileList) {
      this.form.images = fileList
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async save () {
      await this.CREATE_PRODUCT(this.form)

      await this.$router.push({ name: 'Used' })
    },
    manuChanged () {
      this.form.car_manu_name = this.manufacturers.find(el => el.manuId === this.form.car_manu_id).manuName
      this.GET_MANUFACTURER_MODELS({ manufacturer: this.form.car_manu_id })
    },
    modelChanged () {
      this.form.car_mod_name = this.manufacturer_models.find(el => el.modId === this.form.car_mod_id).ModelName
    }
  }
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
