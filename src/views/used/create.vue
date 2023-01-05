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
          <el-button type="primary">{{ $t('actions.add') }} <i class="el-icon-plus el-icon-plus"></i></el-button>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.brand') }}</div>
          <el-select v-model="form.brand"></el-select>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.model') }}</div>
          <el-select v-model="form.model"></el-select>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.name') }}</div>
          <el-input v-model="form.name"></el-input>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.price') }}</div>
          <el-input v-model="form.price" placeholder="Please input" class="input-with-select">
            <el-select v-model="form.currency" slot="prepend" :placeholder="$t('register.currency')" value=""
                       class="w-15">
              <el-option label="manat" :value="1"></el-option>
              <el-option label="dollar" :value="2"></el-option>
              <el-option label="rub" :value="3"></el-option>
            </el-select>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="sub-title">{{ $t('used.about') }}</div>
          <el-input
            type="textarea"
            v-model="form.about"
            :rows="2"
            placeholder="Please input">
          </el-input>
        </el-col>

        <el-col :xs="24" :sm="24" :lg="24" class="mt-4">
          <div class="sub-title">{{ $t('used.images') }}</div>
          <el-upload
            list-type="picture-card"
            multiple
            :auto-upload="false"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
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
        brand: '',
        model: '',
        name: '',
        price: 0,
        currency: 1,
        about: '',
        images: []
      }
    }
  },
  computed: {
    ...mapGetters({
      products: 'parts/products',
    }),
  },
  methods: {
    ...mapActions({
      GET_UPLOADED_DATA_FILES: 'parts/GET_UPLOADED_DATA_FILES',
    }),
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
