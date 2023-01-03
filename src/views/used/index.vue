<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
          $t('dashboard.title')
        }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('menu.used') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always" v-loading.fullscreen.lock="loading">
      <div slot="header" class="clearfix">
        <h2>{{ $t('menu.used') }}</h2>

        <el-button @click="$router.push({'name':'AddUsed'})" type="text" class="float-right">
          <div class="span">
            {{ $t('actions.add') }}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10H15" stroke="#0086C9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 15V5" stroke="#0086C9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

        </el-button>
      </div>

      <template v-if="!products.length">
        <div class="empty_used mb-32">
          <img src="@/assets/img/add_item.svg" alt="">
          <h2>İlk elanını əlavə et</h2>
          <p class="light_text">İlk elanını yarat, satışa başla, gəlir qazan</p>
          <el-button type="primary" @click="$router.push({name: 'AddUsed'})">{{ $t('actions.add') }} <i
            class="el-icon-plus el-icon-plus"></i></el-button>
        </div>
      </template>

      <template v-else>
        <el-row :gutter="16">
          <el-col :md="18">
            <el-input
              v-model="search"
              :placeholder="$t('search')">
            </el-input>
          </el-col>
          <el-col :md="6">
            <el-button type="primary" class="w100" @click="GET_PARTS({search:search})">
              {{ $t('search') }}
            </el-button>
          </el-col>
        </el-row>

        <el-row class="mt-12">
          <el-tabs @tab-click="GET_PARTS({status:activeTab})" v-model="activeTab">
            <el-tab-pane :label="$t('used.statuses.all')" name="1"></el-tab-pane>
            <el-tab-pane :label="$t('used.statuses.active')" name="2"></el-tab-pane>
            <el-tab-pane :label="$t('used.statuses.deactivated')" name="3"></el-tab-pane>
            <el-tab-pane :label="$t('used.statuses.waiting')" name="4"></el-tab-pane>
            <el-tab-pane :label="$t('used.statuses.rejected')" name="5"></el-tab-pane>
          </el-tabs>
        </el-row>

        <div class="used_item_wrapper mb-16">
          <div class="used_item" v-for="product in products"
               @click="$router.push({name: 'EditUsed',params:{id:product.id}})"
               :key="product.id">
            <VueSlickCarousel :arrows="true">
              <div v-for="img in product.url"><img
                :src="img"
                alt=""></div>
            </VueSlickCarousel>
            <h5>{{ product.description }}</h5>
            <p><span>{{ product.manufacturer }}/ {{ product.model }}</span></p>
            <p class="used_item_price"><span>Qiymet:</span>
              <span class="float-right">{{ product.price.price }} {{ product.price.currency_symbol }}</span>
            </p>
          </div>
        </div>

      </template>

      <el-divider></el-divider>

      <el-row type="flex" justify="center">
        <el-pagination
          v-model:currentPage="currentPage"
          :hide-on-single-page="true"
          @current-change="pageChanged"
          background
          layout="prev, pager, next"
          v-bind="pagination">
        </el-pagination>
      </el-row>

    </el-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import loading from 'element-ui/packages/loading'

export default {
  name: 'Used',
  components: { VueSlickCarousel },
  data () {
    return {
      page: 1,
      empty: true,
      activeTab: '1',
      currentPage: 1,
    }
  },
  computed: {
    ...mapGetters({
      products: 'used/products',
      pagination: 'used/pagination',
      loading: 'used/loading',
    }),
    search: {
      get () {
        return this.$store.state.used.search
      },
      set (value) {
        this.$store.commit('used/SET_SEARCH', value)
      }
    }
  },
  async beforeMount () {
    await this.GET_PARTS({ page: this.currentPage })
  },
  methods: {
    loading () {
      return loading
    },
    ...mapActions({
      GET_PARTS: 'used/GET_PRODUCTS',
    }),
    async pageChanged (page) {
      await this.GET_PARTS({ page: page })
    }
  }
}
</script>

<style lang="scss" scoped>
.empty_used {
  display: flex;
  flex-direction: column;
  place-items: center;
}

.used_item_wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(205px, 1fr));
  grid-gap: 25px;
}

.used_item {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .el-button--default {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #344054;
  }

  border: 1px solid #D0D5DD;
  border-radius: 16px;
  padding: 16px;

  h5 {
    margin: 12px 0 2px 0;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #344054;
  }

  p {
    margin: 4px 0;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #344054;

    &.used_item_price {
      color: #0086C9;
    }

    span:first-child {
      font-weight: 500;
      font-size: 12px;
      line-height: 18px;
      color: #98A2B3;
    }
  }

}

.el-button--text {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #0086C9;

  .span {
    display: flex;
    place-items: center;
  }

  svg {
    margin-left: 8px;
  }
}
</style>
