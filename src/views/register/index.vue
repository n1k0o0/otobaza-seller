<template>
  <div class="register-container-wrapper">
    <div class="register-container">
      <div class="title-container">
        <h3 class="title">{{ $t('register.title') }}</h3>
      </div>
      <div class="register-container-form">
        <lang-select class="lang hover-effect" />
        <el-form
          ref="registerForm"
          :loading="loading"
          :model="registerForm"
          :rules="registerRules"
          class="register-form"
          auto-complete="on"
          label-position="left"
        >
          <el-form-item prop="first_name" :label="$t('register.first_name')">
            <el-input v-model="registerForm.first_name" />
          </el-form-item>

          <el-form-item prop="last_name" :label="$t('register.last_name')">
            <el-input v-model="registerForm.last_name" />
          </el-form-item>

          <el-form-item prop="phone" :label="$t('register.phone')">
            <el-input
              ref="phone"
              v-model="registerForm.phone"
              name="phone"
              type="text"
            />
          </el-form-item>

          <el-form-item prop="password" :label="$t('register.password')">
            <el-input v-model="registerForm.password" :type="passwordType" />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>

          <el-form-item prop="email" :label="$t('register.email')">
            <el-input v-model="registerForm.email" type="email" />
          </el-form-item>

          <el-form-item prop="gender" :label="$t('register.gender')">
            <el-select
              v-model="registerForm.gender"
              :placeholder="$t('register.select_gender')"
            >
              <el-option
                v-for="item in genders"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="currency" :label="$t('register.currency')">
            <el-select
              v-model="registerForm.price_types.id"
              :placeholder="$t('register.select_currency')"
            >
              <el-option
                v-for="item in currencies"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="country" :label="$t('register.country')">
            <el-select
              v-model="registerForm.country"
              :placeholder="$t('register.select_country')"
              @change="onCountryChange"
            >
              <el-option
                v-for="item in countries"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="city" :label="$t('register.city')">
            <el-select
              v-model="registerForm.city"
              :placeholder="$t('register.select_city')"
            >
              <el-option
                v-for="item in cities"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="store_name" :label="$t('register.store_name')">
            <el-input v-model="registerForm.store_name" />
          </el-form-item>

          <el-form-item prop="store_about" :label="$t('register.store_about')">
            <el-input v-model="registerForm.store_about" />
          </el-form-item>

          <el-form-item prop="address" :label="$t('register.address')">
            <vue-google-autocomplete
              id="map"
              :country="['az', 'ge']"
              classname="el-input__inner"
              placeholder=""
              enable-geolocation
              @placechanged="getAddressData"
              @inputChange="addressManuallyChanged"
            />
          </el-form-item>

          <div class="register-form-buttons">
            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;margin-bottom:30px;"
              @click.native.prevent="handleRegister"
            >{{ $t('register.title') }}</el-button>
            <div class="or">
              <span>{{ $t('or') }}</span>
            </div>
            <el-button
              type="secondary"
              style="width:100%;margin-bottom:30px;"
              @click.native.prevent="handleLogin"
            >{{ $t('login.title') }}</el-button>
          </div>
        </el-form>
        <el-dialog :visible.sync="otpShow" width="30%">
          <div class="mb-1">{{ $t('otp.title') }}</div>
          <el-input v-model="otp" type="text" class="otp_input" />
          <div v-if="!showTimer" class="no-receive">
            {{ $t('verificationSmsNotReceived') }}?
            <a href="#" @click.prevent="resendOtp">{{ $t('resend_otp') }}.</a>
          </div>
          <div v-else class="no-receive">
            <CountDownTimer
              v-if="showTimer"
              :show.sync="showTimer"
              :time-limit="timerLimit"
            >
              <template slot-scope="{ time }">
                {{ $t('for_resend_please_wait', { time }) }}
              </template>
            </CountDownTimer>
          </div>
          <template slot="footer" class="dialog-footer">
            <el-button @click="otpShow = false">{{ $t('cancel') }}</el-button>
            <el-button
              :disabled="isOtpDisabled"
              type="primary"
              @click.prevent="submitOtp"
            >{{ $t('confirm') }}</el-button>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import CountDownTimer from '@/components/CountDownTimer'
import LangSelect from '@/components/LangSelect/index'
import validators from '@/utils/validators'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import { mapActions } from 'vuex'
export default {
  name: 'Register',
  components: { CountDownTimer, LangSelect, VueGoogleAutocomplete },
  data() {
    const {
      first_name,
      last_name,
      phone,
      gender,
      country,
      city,
      password,
      store_name,
      address
    } = validators()
    return {
      genders: [
        {
          value: 1,
          label: this.$t('male')
        },
        {
          value: 0,
          label: this.$t('female')
        }
      ],
      showTimer: false,
      timerLimit: 120,
      otp: '',
      otpShow: false,
      response: {},
      registerForm: {
        first_name: '',
        last_name: '',
        phone: '',
        gender: 1,
        group_id: 2,
        price_types: {
          id: 4
        },
        country: '',
        city: '',
        email: '',
        address: '',
        password: '',
        store_name: '',
        store_about: '',
        latitude: '',
        longitude: ''
      },
      registerRules: {
        first_name: [
          { required: true, trigger: 'change', validator: first_name }
        ],
        last_name: [
          { required: true, trigger: 'change', validator: last_name }
        ],
        phone: [{ required: true, trigger: 'change', validator: phone }],
        gender: [{ required: true, trigger: 'change', validator: gender }],
        country: [{ required: true, trigger: 'change', validator: country }],
        city: [{ required: true, trigger: 'change', validator: city }],
        password: [{ required: true, trigger: 'change', validator: password }],
        address: [{ required: true, trigger: 'change', validator: address }],
        store_name: [
          { required: true, trigger: 'change', validator: store_name }
        ],
        email: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('validator.email.required')
          },
          {
            type: 'email',
            trigger: 'change',
            message: this.$t('validator.email.email')
          }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    countries() {
      return this.$store.getters['app/countries'].map(item => {
        return {
          value: item.id,
          label: item.native_name
        }
      })
    },
    isOtpDisabled() {
      return this.otp.length > 4 || this.otp.length < 4 || !Number(this.otp)
    },
    cities() {
      const country = this.$store.getters['app/countries'].find(
        item => item.id === this.registerForm.country
      )
      return country
        ? country.cities.map(item => {
          return {
            value: item.id,
            label: item.name,
            lat: item.lat,
            lng: item.lng
          }
        })
        : []
    },
    currencies() {
      return this.$store.getters['app/currencies'].map(item => {
        return {
          value: item.id,
          label: item.currency_code
        }
      })
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  async beforeMount() {
    await this.GET_CURRENCIES()
    await this.GET_SETTINGS()
  },
  methods: {
    ...mapActions({
      GET_CURRENCIES: 'app/GET_CURRENCIES',
      GET_SETTINGS: 'app/GET_SETTINGS',
      SEND_OTP: 'user/SEND_OTP',
      RESEND_OTP: 'user/RESEND_OTP'
    }),
    resendOtp() {
      this.RESEND_OTP({
        token: this.response?.token
      })
        .then(response => {
          this.$message({
            message: response?.data?.message || 'Göndərildi!',
            type: 'success',
            showClose: true
          })
          this.showTimer = true
        })
        .catch(error => {
          const { message } = error.response.data
          this.$message({
            message,
            type: 'error',
            showClose: true
          })
        })
    },
    addressManuallyChanged({ newVal }) {
      if (!newVal) {
        this.registerForm.address = ''
        this.registerForm.latitude = ''
        this.registerForm.longitude = ''
      }
    },
    getAddressData(addressData) {
      const { route, latitude, longitude } = addressData
      this.registerForm.address = route
      this.registerForm.latitude = latitude
      this.registerForm.longitude = longitude
    },
    async submitOtp() {
      const token = this.response.token
      const code = +this.otp
      await this.SEND_OTP({
        code,
        token
      }).then(() => {
        this.loading = true
        this.$store
          .dispatch('user/login', {
            phone: this.registerForm.phone,
            password: this.registerForm.password
          })
          .then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    onCountryChange() {
      this.registerForm.city = ''
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$router.push({
        path: '/login'
      })
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/SIGN_UP', this.registerForm)
            .then(response => {
              if (response?.data) {
                this.response = response?.data
                const { is_phone_verified } = this.response
                if (!is_phone_verified) {
                  this.otpShow = true
                  this.showTimer = true
                }
              }
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}
.register-container-wrapper {
  min-height: 100%;
  width: 100vw;
  background: #2d3a4b;
}
#map {
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  background: rgba(0, 0, 0, 0.1) !important;
  padding: 12px 15px 12px 15px !important;
  height: 47px;
  line-height: 47px;
  color: #fff;
}
/* reset element-ui css */
.register-container {
  position: relative;
  padding: 60px 0 35px;
  max-width: 800px;
  margin: 0 auto;
  .lang {
    position: absolute;
    right: 16px;
    top: 10px;
    color: #fff;
  }
  .register-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 16px;
    grid-template-areas: '. .' '. .' '. .' '. .' '. .' '. .' '. .' 'buttons buttons';
  }
  .register-form-buttons {
    grid-area: buttons;
  }
  &-form {
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
  }
  .el-select {
    width: 100%;
  }
  .el-form-item {
    &__label {
      color: #fff;
    }
  }
  .otp_input {
    caret-color: #454545 !important;
    input {
      color: #454545 !important;
      caret-color: #454545 !important;
    }
  }
  .el-input,
  .el-textarea {
    display: inline-block;
    height: 47px;
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;

    input,
    textarea {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 15px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-textarea {
    height: 120px !important;
    padding: 15px;
    textarea {
      height: 100% !important;
      resize: none;
      padding: 0;
    }
  }
}
</style>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    bottom: 1px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .or {
    position: relative;
    text-align: center;
    height: 18px;
    margin-bottom: 30px;
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      background: #fff;
      height: 1px;
    }
    span {
      position: absolute;
      left: 50%;
      padding: 0 10px;
      transform: translateX(-50%);
      z-index: 100;
      background: $bg;
      color: #fff;
    }
  }
}
@media screen and (max-width: 768px) {
  .register-container {
    padding: 60px 15px 60px;
    .register-form {
      display: block;
    }
  }
}
.no-receive {
  margin-top: 10px;
  a {
    color: #409eff;
    text-decoration: underline;
  }
}
</style>
