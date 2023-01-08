<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
        $t('dashboard.title')
      }}
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/used' }">{{ $t('menu.used') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ product.model }}</el-breadcrumb-item>
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
          <el-button v-show="!edit && product.status !=='active'" type="success" @click="changeStatus()">
            {{ $t('actions.activate') }}
            <i class="el-icon-switch-button" />
          </el-button>
          <el-button v-show="!edit && product.status ==='active'" @click="changeStatus()">
            {{ $t('actions.deactivate') }}
            <i class="el-icon-switch-button" />
          </el-button>

          <el-button v-show="!edit" type="primary" @click="edit=true">{{ $t('actions.edit') }} <i
            class="el-icon-plus el-icon-plus"
          /></el-button>
          <el-button v-show="edit" type="primary" @click="save">{{ $t('actions.save') }} <i
            class="el-icon-document-checked"
          /></el-button>
        </div>
      </template>

      <el-row :gutter="20" class="tariffs">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="tariffs_item" @click="changeTariff($t('actions.tariff_forward'))">
            <img src="@/assets/img/forward.png" alt="">
            {{ $t('actions.tariff_forward') }}
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="tariffs_item" @click="changeTariff($t('actions.tariff_vip'))">
            <img src="@/assets/img/vip.png" alt="">
            {{ $t('actions.tariff_vip') }}
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="tariffs_item" @click="changeTariff($t('actions.tariff_special'))">
            <img src="@/assets/img/special.png" alt="">
            {{ $t('actions.tariff_special') }}
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.brand') }}</div>
          <el-select v-model="product.brand" :disabled="!edit" />
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.model') }}</div>
          <el-select v-model="product.model" :disabled="!edit" />
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.name') }}</div>
          <el-input v-model="product.name" :disabled="!edit" />
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="sub-title">{{ $t('used.price') }}</div>
          <el-input
            v-model="product.price.price"
            :disabled="!edit"
            placeholder="Please input"
            class="input-with-select"
          >
            <el-select
              slot="prepend"
              v-model="product.price.currency"
              :disabled="!edit"
              :placeholder="$t('register.currency')"
              value=""
              class="w-15"
            >
              <el-option label="manat" :value="1" />
              <el-option label="dollar" :value="2" />
              <el-option label="rub" :value="3" />
            </el-select>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="sub-title">{{ $t('used.about') }}</div>
          <el-input
            v-model="product.about"
            :disabled="!edit"
            type="textarea"
            :rows="2"
            placeholder="Please input"
          />
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
            action=""
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-col>
      </el-row>

    </el-card>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
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
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      edit: false,
      tariffModal: false,
      tariffModalHeader: ''
    }
  },
  computed: {
    ...mapGetters({
      product: 'used/product'
    })
  },
  async beforeMount() {
    await this.GET_PRODUCT(this.$route.params.id)
  },
  methods: {
    ...mapActions({
      GET_PRODUCT: 'used/GET_PRODUCT',
      SAVE_PRODUCT: 'used/SAVE_PRODUCT'
    }),
    async handleRemove(file, fileList) {
      if (file.id) {
        const tt = this.$confirm(this.$t('remove_question'))
        tt.then(() => {
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
        return tt
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handlePictureChanged(file, fileList) {
      this.product.url = fileList
    },
    save() {
      this.edit = false
      this.SAVE_PRODUCT()
    },
    changeTariff(title) {
      this.tariffModalHeader = title
      this.tariffModal = true
    },
    changeStatus() {
      this.product.status = this.product.status === 'active' ? 'disabled' : 'active'
      this.$message({
        message: 'Success.',
        type: 'success'
      })
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
