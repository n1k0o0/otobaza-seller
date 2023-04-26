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
      <el-breadcrumb-item>{{ $t('menu.used') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card
      v-loading.fullscreen.lock="loading"
      shadow="always"
    >
      <template slot="header">
        <div>
          <h2 class="w100">
            {{ $t('menu.used') }}
          </h2>
          <p class="stats">
            {{ $t('used.add_count') }}: <span>{{ statuses_count.total }}</span> {{ $t('used.package_limit') }}:
            <span>{{ current_package.used_parts_limit || 0 }}</span>
          </p>
        </div>
        <el-button
          type="text"
          class="float-right"
          @click="$router.push({'name':'AddUsed'})"
        >
          <div class="span">
            {{ $t('actions.add') }}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 10H15"
                stroke="#0086C9"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 15V5"
                stroke="#0086C9"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </el-button>
      </template>

      <template v-if="!statuses_count.total">
        <div class="empty_used mb-32">
          <img
            src="@/assets/img/add_item.svg"
            alt=""
          >
          <h2>{{ $t('used.add_first_ad') }}</h2>
          <p class="light_text">
            {{ $t('used.first_ad_text') }}
          </p>
          <el-button
            type="primary"
            @click="$router.push({name: 'AddUsed'})"
          >
            {{ $t('actions.add') }} <i
              class="el-icon-plus el-icon-plus"
            />
          </el-button>
        </div>
      </template>

      <template v-else>
        <el-row :gutter="16">
          <el-col :md="18">
            <el-input
              v-model="search"
              clearable
              :placeholder="$t('search')"
              @clear="GET_PARTS({search:search})"
            />
          </el-col>
          <el-col :md="6">
            <el-button
              type="primary"
              :disabled="search.length<4 && search.length>0"
              class="w100"
              @click="GET_PARTS({search:search})"
            >
              {{ $t('search') }}
            </el-button>
          </el-col>
        </el-row>

        <el-row class="mt-12">
          <el-tabs
            v-model="activeTab"
            @tab-click="GET_PARTS({status:activeTab})"
          >
            <el-tab-pane
              :label="$t('used.statuses.all')"
              name="9"
            >
              <span slot="label">
                {{ $t('used.statuses.all') }} ({{ statuses_count['total'] }})
              </span>
            </el-tab-pane>
            <el-tab-pane
              :label="$t('used.statuses.on_site')"
              name="1"
            >
              <span slot="label">
                {{ $t('used.statuses.on_site') }} ({{ statuses_count.group_summary.approved }})
              </span>
            </el-tab-pane>
            <el-tab-pane
              :label="$t('used.statuses.expired')"
              name="3"
            >
              <span slot="label">
                {{ $t('used.statuses.expired') }} ({{ statuses_count.group_summary.expired }})
              </span>
            </el-tab-pane>
            <el-tab-pane
              :label="$t('used.statuses.waiting')"
              name="2"
            >
              <span slot="label">
                {{ $t('used.statuses.waiting') }} ({{ statuses_count.group_summary.waiting }})
              </span>
            </el-tab-pane>
            <el-tab-pane
              :label="$t('used.statuses.rejected')"
              name="0"
            >
              <span slot="label">
                {{ $t('used.statuses.rejected') }} ({{ statuses_count.group_summary.rejected }})
              </span>
            </el-tab-pane>
            <el-tab-pane
              :label="$t('used.statuses.deactivated')"
              name="4"
            >
              <span slot="label">
                {{ $t('used.statuses.deactivated') }} ({{ statuses_count.group_summary.deactivated }})
              </span>
            </el-tab-pane>
          </el-tabs>
        </el-row>

        <div class="used_item_wrapper mb-16">
          <div
            v-for="product in products"
            :key="product.id"
            class="used_item"
            @click="$router.push({name: 'EditUsed',params:{id:product.id}})"
          >
            <div
              class="used_item_status"
              :class="'status_'+product.status"
            >
              <span>{{ getStatusText(product.status) }}</span>
            </div>

            <div class="used_item_image">
              <img
                v-if="product.images.length"
                :src="product.images[0].link"
                alt=""
              >
              <img
                v-else
                src="@/assets/img/default-parts.png"
                alt=""
              >
            </div>


            <div class="text-center" />
            <h5>{{ product.description }}</h5>
            <p>
              <span>{{ product.car_manu_name }}/ {{
                product.car_mod_name
              }}</span>
            </p>
            <p class="used_item_price">
              <span>Qiymet:</span>
              <span class="float-right">{{ product.price }} {{ product.price_type.name }}</span>
            </p>
          </div>
        </div>
      </template>

      <el-divider />

      <el-row
        type="flex"
        justify="center"
      >
        <el-pagination
          v-model="currentPage"
          :hide-on-single-page="true"
          background
          layout="prev, pager, next"
          :page-size="pagination.per_page"
          v-bind="pagination"
          @current-change="pageChanged"
        />
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import loading from 'element-ui/packages/loading'

export default {
  name: 'Used',
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
      statuses_count: 'used/statuses_count',
      current_package: 'packages/current_package',
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
    await this.GET_STATUSES_COUNT()
    await this.GET_SELLER_PACKAGE()
  },
  methods: {
    loading () {
      return loading
    },
    ...mapActions({
      GET_PARTS: 'used/GET_PRODUCTS',
      GET_STATUSES_COUNT: 'used/GET_STATUSES_COUNT',
      GET_SELLER_PACKAGE: 'packages/GET_SELLER_PACKAGE',
    }),
    async pageChanged (page) {
      await this.GET_PARTS({ page: page })
    },
    getStatusText (status) {
      switch (status) {
        case 0:
          return this.$t('used.statuses.rejected')
        case 1:
          return this.$t('used.statuses.active')
        case 2:
          return this.$t('used.statuses.waiting')
        case 3:
          return this.$t('used.statuses.expired')
        case 4:
          return this.$t('used.statuses.deactivated')
        default :
          return 'Unknown'
      }
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
  position: relative;
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

  &_image {
    display: flex;
    place-content: center;

    img {
      width: 150px;
      height: 150px;
      object-position: center;
      object-fit: cover;
    }
  }

  &_status {
    position: absolute;
    left: 8px;
    top: 8px;
    font-size: 14px;
    line-height: 18px;
    border-radius: 16px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px 15px;


    &.status_0 {
      color: #B54708;
      background: #FFFAEB;
    }

    &.status_1 {
      color: #027A48;
      background: #ECFDF3;
    }

    &.status_2 {
      color: #175CD3;
      background: #EFF8FF;
    }

    &.status_3 {
      color: #B42318;
      background: #FEF3F2;
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

.el-tabs__item span {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #98A2B3 !important;

  &.is-active {
    color: #344054 !important;
  }
}

.el-tabs__item.is-active span {
  color: #344054 !important;
}

.stats {
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: #344054;

  span {
    color: #026AA2;
    font-style: italic;
  }
}
</style>
