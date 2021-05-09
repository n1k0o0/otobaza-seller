<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
        $t('dashboard.title')
      }}</el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{ path: '/dismantles' }"
      >Dismantles</el-breadcrumb-item>
      <el-breadcrumb-item v-if="pageTitle">{{ pageTitle }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card v-loading="loading" shadow="always">
      <div slot="header" class="clearfix">
        <h2>{{ pageTitle }}</h2>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-form-item
          :label="$t('dismantles.manufacturer')"
          prop="manufacturer"
        >
          <el-select
            v-model="form.manufacturer"
            value-key="manuId"
            filterable
            class="w100"
            :placeholder="$t('dismantles.select_manufacturer')"
            @change="onManufacturerChange"
          >
            <el-option
              v-for="item in manufacturers"
              :key="item.manuId"
              :label="item.manuName"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('dismantles.model')" prop="model">
          <el-select
            v-model="form.model"
            value-key="modId"
            :disabled="!isManufacturerSelected"
            filterable
            class="w100"
            :placeholder="$t('dismantles.select_model')"
            @change="onModelChange"
          >
            <el-option
              v-for="item in manufacturer_models"
              :key="item.modId"
              :label="item.ModelName"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('dismantles.car')" prop="car">
          <el-select
            v-model="form.car"
            value-key="carid"
            :disabled="!isModelSelected"
            filterable
            class="w100"
            :placeholder="$t('dismantles.select_car')"
          >
            <el-option
              v-for="item in model_cars"
              :key="item.carid"
              :label="item.carName"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('dismantles.year')" prop="year">
          <el-date-picker
            v-model="form.year"
            format="yyyy"
            type="year"
            class="w100"
            value-format="yyyy"
            :placeholder="$t('dismantles.select_year')"
            :picker-options="yearPicker"
          />
        </el-form-item>
        <el-form-item :label="$t('dismantles.color')" prop="color">
          <el-select
            v-model="form.color"
            filterable
            value-key="id"
            class="w100"
            :placeholder="$t('dismantles.select_color')"
          >
            <el-option
              v-for="color in colors"
              :key="color.id"
              :label="color.color"
              :value="color.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('dismantles.type')" prop="type">
          <el-input v-model="form.type" />
        </el-form-item>
        <el-form-item :label="$t('dismantles.engine')" prop="engine">
          <el-input v-model="form.engine" />
        </el-form-item>
        <el-form-item
          :label="$t('dismantles.transmission')"
          prop="transmission"
        >
          <el-input v-model="form.transmission" />
        </el-form-item>
        <el-form-item :label="$t('dismantles.milage')" prop="milage">
          <el-input-number
            v-model.number="form.milage"
            class="milage"
            :step="1"
            :controls="false"
          />
        </el-form-item>
        <el-form-item :label="$t('dismantles.description')" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item :label="$t('dismantles.images')" prop="images">
          <el-upload
            action="#"
            multiple
            :auto-upload="false"
            list-type="picture-card"
            :file-list="form.images"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            accept="image/*"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <!-- Submit button -->
        <el-form-item>
          <el-button
            :disabled="formLoading"
            :loading="formLoading"
            type="primary"
            @click="submitForm('form')"
          >{{ $t('dismantles.save') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'DismantlesEdit',
  data() {
    const formData = new FormData()
    return {
      yearPicker: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      formData,
      loading: true,
      formLoading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      form: {
        manufacturer: null,
        model: null,
        color: '',
        car: null,
        type: '',
        engine: '',
        transmission: '',
        milage: null,
        description: '',
        images: []
      },
      rules: {
        manufacturer: {
          required: true,
          message: this.$t('validator.manufacturer.required'),
          trigger: 'blur'
        },
        model: {
          required: true,
          message: this.$t('validator.model.required'),
          trigger: 'blur'
        },
        car: {
          required: true,
          message: this.$t('validator.car.required'),
          trigger: 'blur'
        },
        year: {
          required: true,
          message: this.$t('validator.year.required'),
          trigger: 'blur'
        },
        color: {
          required: true,
          message: this.$t('validator.color.required'),
          trigger: 'blur'
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      dismantle: 'dismantles/dismantle',
      manufacturers: 'catalog/manufacturers',
      manufacturer_models: 'catalog/manufacturer_models',
      model_cars: 'catalog/model_cars',
      colors: 'catalog/colors'
    }),
    pageTitle() {
      return this.dismantle?.name || ''
    },
    isManufacturerSelected() {
      return this.form?.manufacturer?.manuId
    },
    isModelSelected() {
      return this.form?.model?.modId
    }
  },
  async beforeMount() {
    await this.$store.dispatch('catalog/GET_MANUFACTURERS')
    await this.$store.dispatch('catalog/GET_COLORS')

    const id = this.$route.params.id
    await this.$store
      .dispatch('dismantles/GET_DISMANTLE', {
        id
      })
      .then(async() => {
        const {
          car_id,
          manu_id,
          mod_id,
          model,
          car_name,
          brand,
          color,
          transmission,
          engine,
          milage,
          description,
          type,
          year
        } = this.dismantle
        let { images } = this.dismantle
        images = images.map(image => {
          image.name = image.link.split('/').pop()
          image.url = image.link
          return image
        })

        this.form = {
          manufacturer: {
            manuId: manu_id,
            manuName: brand
          },
          model: {
            modId: mod_id,
            ModelName: model
          },
          car: {
            carid: car_id,
            carName: car_name
          },
          year: year + '',
          type,
          transmission,
          engine,
          milage,
          description,
          color: color.id,
          images
        }
        await this.$store.dispatch('catalog/GET_MANUFACTURER_MODELS', {
          manufacturer: this.form.manufacturer.manuId
        })
        await this.$store.dispatch('catalog/GET_MODEL_CARS', {
          model: this.form.model.modId
        })
        this.loading = false
      })
  },
  async beforeDestroy() {
    this.$store.commit('dismantles/CLEAR_DISMANTLE')
  },
  methods: {
    async onManufacturerChange() {
      this.form.model = null
      await this.$store.dispatch('catalog/GET_MANUFACTURER_MODELS', {
        manufacturer: this.form.manufacturer.manuId
      })
    },
    async onModelChange() {
      this.form.car = null
      await this.$store.dispatch('catalog/GET_MODEL_CARS', {
        model: this.form.model.modId
      })
    },
    async handleRemove(file, fileList) {
      const { id } = file
      if (id) {
        await this.$store
          .dispatch('dismantles/DELETE_DISMANTLE_IMAGE', {
            id
          })
          .then(() => {
            this.form.images = fileList
          })
      } else {
        this.form.images = fileList
      }
    },
    handleChange(file, fileList) {
      this.form.images = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async submitForm(formName) {
      this.formData = new FormData()
      await this.$refs[formName].validate(async valid => {
        if (valid) {
          this.formLoading = true
          const {
            year,
            color,
            type,
            engine,
            transmission,
            milage,
            description
          } = this.form
          const form = {
            manu_id: this.form.manufacturer.manuId,
            brand: this.form.manufacturer.manuName,
            mod_id: this.form.model.modId,
            model: this.form.model.ModelName,
            car_id: this.form.car.carid,
            car_name: this.form.car.carName,
            year,
            color,
            type,
            engine,
            transmission,
            milage,
            description
          }

          Object.keys(form).map(key => {
            this.formData.append(key, form[key])
          })

          this.form.images.map(image => {
            if (image.status === 'ready') {
              this.formData.append('images[]', image.raw)
            }
          })

          await this.$store
            .dispatch('dismantles/UPDATE_DISMANTLE', {
              id: this.$route.params.id,
              formData: this.formData
            })
            .then(() => {
              this.$router.go()
            })
            .finally(() => {
              this.formLoading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
