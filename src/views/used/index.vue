<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
          $t('dashboard.title')
        }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('menu.used') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card v-loading.fullscreen.lock="loading" shadow="always">
      <template slot="header">
        <h2>{{ $t('menu.used') }}</h2>

        <el-button type="text" class="float-right" @click="$router.push({'name':'AddUsed'})">
          <div class="span">
            {{ $t('actions.add') }}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10H15" stroke="#0086C9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 15V5" stroke="#0086C9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

        </el-button>
      </template>

      <template v-if="false">
        <div class="empty_used mb-32">
          <img src="@/assets/img/add_item.svg" alt="">
          <h2>İlk elanını əlavə et</h2>
          <p class="light_text">İlk elanını yarat, satışa başla, gəlir qazan</p>
          <el-button type="primary" @click="$router.push({name: 'AddUsed'})">{{ $t('actions.add') }} <i
            class="el-icon-plus el-icon-plus"
          /></el-button>
        </div>
      </template>

      <template v-else>
        <el-row :gutter="16">
          <el-col :md="18">
            <el-input
              v-model="search"
              :placeholder="$t('search')"
            />
          </el-col>
          <el-col :md="6">
            <el-button type="primary" :disabled="search.length<4" class="w100" @click="GET_PARTS({search:search})">
              {{ $t('search') }}
            </el-button>
          </el-col>
        </el-row>

        <el-row class="mt-12">
          <el-tabs @tab-click="GET_PARTS({status:activeTab})" v-model="activeTab">
            <el-tab-pane :label="$t('used.statuses.all')" name="9"></el-tab-pane>
            <el-tab-pane :label="$t('used.statuses.active')" name="1"></el-tab-pane>
            <el-tab-pane :label="$t('used.statuses.deactivated')" name="3"></el-tab-pane>
            <el-tab-pane :label="$t('used.statuses.waiting')" name="2"></el-tab-pane>
            <el-tab-pane :label="$t('used.statuses.rejected')" name="0"></el-tab-pane>
          </el-tabs>
        </el-row>

        <div class="used_item_wrapper mb-16">
          <div class="used_item" v-for="product in products"
               @click.self="$router.push({name: 'EditUsed',params:{id:product.id}})"
               :key="product.id">
            <VueSlickCarousel :arrows="true" v-if="product.images.length">
              <div v-for="img in product.images">
                <img
                  :src="img.link"
                  alt="">
              </div>

            </VueSlickCarousel>
            <div @click.self="$router.push({name: 'EditUsed',params:{id:product.id}})" v-else class="text-center">
              <img
                src="@/assets/img/default-parts.png"
                alt="">
            </div>
            <h5 @click.self="$router.push({name: 'EditUsed',params:{id:product.id}})">{{ product.description }}</h5>
            <p @click.self="$router.push({name: 'EditUsed',params:{id:product.id}})"><span>{{ product.car_manu_name }}/ {{
                product.car_mod_name
              }}</span></p>
            <p @click.self="$router.push({name: 'EditUsed',params:{id:product.id}})" class="used_item_price"><span>Qiymet:</span>
              <span class="float-right">{{ product.price }} {{ product.price_type.name }}</span>
            </p>
          </div>
        </div>

      </template>

      <el-divider/>

      <el-row type="flex" justify="center">
        <el-pagination
          v-model:currentPage="currentPage"
          :hide-on-single-page="true"
          background
          layout="prev, pager, next"
          v-bind="pagination"
          @current-change="pageChanged"
        />
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
      activeTab: '9',
      currentPage: 1,
    }
  },
  computed: {
    ...mapGetters({
      products: 'used/products',
      pagination: 'used/pagination',
      loading: 'used/loading'
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
    await this.GET_PARTS({ status: this.activeTab, page: this.currentPage })
  },
  methods: {
    loading () {
      return loading
    },
    ...mapActions({
      GET_PARTS: 'used/GET_PRODUCTS'
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
  grid-template-columns: repeat(auto-fill, minmax(205px, 1fr));
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
    margin: 0;
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

.slick-slide {
  img {
    height: 150px !important;
  }
}
</style>
