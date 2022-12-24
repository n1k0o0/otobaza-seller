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
          <el-select :disabled="!edit" v-model="product.brand"></el-select>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.model') }}</div>
          <el-select :disabled="!edit" v-model="product.model"></el-select>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.name') }}</div>
          <el-input :disabled="!edit" v-model="product.name"></el-input>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.price') }}</div>
          <el-input :disabled="!edit" v-model="product.price.price" placeholder="Please input"
                    class="input-with-select">
            <el-select v-model="product.price.currency" :disabled="!edit" slot="prepend"
                       :placeholder="$t('register.currency')" value="" class="w-15">
              <el-option label="manat" :value="1"></el-option>
              <el-option label="dollar" :value="2"></el-option>
              <el-option label="rub" :value="3"></el-option>
            </el-select>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="sub-title">{{ $t('used.about') }}</div>
          <el-input
            :disabled="!edit"
            type="textarea"
            v-model="product.about"
            :rows="2"
            placeholder="Please input">
          </el-input>
        </el-col>

        <el-col :xs="24" :sm="24" :lg="24" class="mt-4">
          <div class="sub-title">{{ $t('used.images') }}</div>
          <el-upload
            :file-list="product.url"
            :disabled="!edit"
            list-type="picture-card"
            multiple
            :auto-upload="false"
            :on-preview="handlePictureCardPreview"
            :before-remove="handleRemove"
            :on-change="handlePictureChanged"
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
      edit: false,
    }
  },
  computed: {
    ...mapGetters({
      product: 'used/product',
    }),
  },
  async beforeMount () {
    await this.GET_PRODUCT(this.$route.params.id)
  },
  methods: {
    ...mapActions({
      GET_PRODUCT: 'used/GET_PRODUCT',
      SAVE_PRODUCT: 'used/SAVE_PRODUCT',
    }),
    async handleRemove (file, fileList) {
      if (file.id) {
        let ttt = false
        return this.$confirm(`Cancel the transfert of ${file.name} ?`)
      }
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handlePictureChanged (file, fileList) {
      this.product.url = fileList
    },
    save () {
      this.edit = false
      this.SAVE_PRODUCT()
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
