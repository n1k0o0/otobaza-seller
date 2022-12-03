<template>
  <div class="register-container-wrapper">
    <div class="register-container">
      <div class="auth_logo">
        <img
          class="pic-404__parent"
          src="@/assets/img/logo.svg"
          alt="404"
        >
      </div>
      <div class="title-container">
        <h3 class="title">{{ $t('register.title') }}</h3>
      </div>
      <div class="register-container-form">
        <lang-select class="lang hover-effect"/>
        <el-form
          ref="registerForm"
          :loading="loading"
          :model="registerForm"
          :rules="registerRules"
          class="register-form"
          auto-complete="on"
          label-position="left"
        >
          <el-form-item prop="first_name" :label="$t('register.first_name')"
                        :class="{ 'filled_label': registerForm.first_name}">
            <el-input v-model="registerForm.first_name"/>
          </el-form-item>

          <el-form-item prop="last_name" :label="$t('register.last_name')"
                        :class="{ 'filled_label': registerForm.last_name}">
            <el-input v-model="registerForm.last_name"/>
          </el-form-item>

          <el-form-item prop="phone" :label="$t('register.phone')" :class="{ 'filled_label': registerForm.phone}">
            <el-input
              ref="phone"
              v-model="registerForm.phone"
              name="phone"
              type="text"
              placeholder="+994551002030"
              v-mask="['(+###) ## ###-##-##']"
            />
          </el-form-item>

          <el-form-item prop="email" :label="$t('register.email')" :class="{ 'filled_label': registerForm.email}">
            <el-input v-model="registerForm.email" type="email"/>
          </el-form-item>

          <el-form-item prop="password" :label="$t('register.password')"
                        :class="{ 'filled_label': registerForm.password}">
            <el-input auto-complete="new-password" v-model="registerForm.password" :type="passwordType"/>
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>

          <el-form-item prop="password_confirmation" :label="$t('register.password_confirmation')"
                        :class="{ 'filled_label': registerForm.password_confirmation}">
            <el-input v-model="registerForm.password_confirmation" :type="passwordType"/>
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>

          <el-form-item prop="currency" :label="$t('register.currency')"
                        :class="{ 'filled_label': registerForm.price_types.id}">
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

          <el-form-item prop="country" :label="$t('register.country')" :class="{ 'filled_label': registerForm.country}">
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

          <el-form-item prop="city" :label="$t('register.city')" :class="{ 'filled_label': registerForm.city}">
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

          <el-form-item prop="store_name" :label="$t('register.store_name')"
                        :class="{ 'filled_label': registerForm.store_name}">
            <el-input v-model="registerForm.store_name"/>
          </el-form-item>

          <el-form-item prop="store_about" :label="$t('register.store_about')" class="grid-col-full"
                        :class="{ 'filled_label': registerForm.store_about}">
            <el-input v-model="registerForm.store_about"/>
          </el-form-item>

          <el-form-item prop="address" :label="$t('register.address')" class='address_map'
                        :class="{ 'filled_label': registerForm.currentAddress}">
            <!--            <vue-google-autocomplete-->
            <!--              v-model="registerForm.address"-->
            <!--              id="map"-->
            <!--              :country="['az', 'ge']"-->
            <!--              classname="el-input__inner"-->
            <!--              placeholder=""-->
            <!--              enable-geolocation-->
            <!--              @placechanged="getAddressData"-->
            <!--              @inputChange="addressManuallyChanged"-->
            <!--            />-->
            <template #label>
              {{ $t('register.address') }}
            </template>
            <vue-google-select
              @mapAddressData="setMapData"
            >
            </vue-google-select>
          </el-form-item>

          <el-form-item prop="agreement" class="form_agreement">
            <el-checkbox id="agreement" v-model="registerForm.agreement"/>
            <a href="https://otobaza.com/terms.html" target="_blank" slot="label">{{ $t('register.agreement') }}</a>
          </el-form-item>

          <div class="register-form-buttons">
            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;margin-bottom:30px;"
              @click.native.prevent="handleRegister"
            >{{ $t('register.title') }}
            </el-button>
            <div class="or">
              <span>{{ $t('or') }}</span>
            </div>
            <el-button
              type="secondary"
              style="width:100%;margin-bottom:30px;"
              @click.native.prevent="handleLogin"
            >{{ $t('login.title') }}
            </el-button>
          </div>
        </el-form>
        <el-dialog :visible.sync="otpShow" width="30%">
          <div class="mb-1">{{ $t('otp.title') }}</div>
          <el-input v-model="otp" type="text" class="otp_input"/>
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
            >{{ $t('confirm') }}
            </el-button>
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
import VueGoogleSelect from '@/components/MapSelect'
import { mapActions } from 'vuex'
import i18n from '@/lang'
import { mask } from 'vue-the-mask'

export default {
  name: 'Register',
  components: { CountDownTimer, LangSelect, VueGoogleAutocomplete, VueGoogleSelect },
  directives: { mask },
  data () {
    const confirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error(i18n.t('validator.password.not_equal')))
      } else {
        callback()
      }
    }
    const {
      first_name,
      last_name,
      phone,
      gender,
      country,
      city,
      password,
      store_name,
      address,
      agreement
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
        password_confirmation: '',
        store_name: '',
        store_about: '',
        latitude: '',
        longitude: '',
        currentAddress: '',
        agreement: ''
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
        password_confirmation: [{ required: true, trigger: 'change', validator: confirmPassword }],
        address: [{ required: true, trigger: 'change', validator: address }],
        agreement: [{ required: true, trigger: 'change', validator: agreement }],
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
    countries () {
      return this.$store.getters['app/countries'].map(item => {
        return {
          value: item.id,
          label: item.native_name
        }
      })
    },
    isOtpDisabled () {
      return this.otp.length > 4 || this.otp.length < 4 || !Number(this.otp)
    },
    cities () {
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
    currencies () {
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
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  async beforeMount () {
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
    resendOtp () {
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
    addressManuallyChanged ({ newVal }) {
      if (!newVal) {
        this.registerForm.address = ''
        this.registerForm.latitude = ''
        this.registerForm.longitude = ''
      }
    },
    getAddressData (addressData) {
      console.log(addressData)
      const { route, lat, lng } = addressData.newLatLng
      this.registerForm.address = addressData.address
      this.registerForm.latitude = lat
      this.registerForm.longitude = lng
    },
    setMapData (data) {
      this.registerForm.latitude = data.lat
      this.registerForm.longitude = data.lng
      this.registerForm.address = data.address
      this.registerForm.currentAddress = data.currentAddress
    },
    async submitOtp () {
      const token = this.response.token
      const code = +this.otp
      await this.SEND_OTP({
        code,
        token
      }).then(() => {
        this.loading = true
        this.$store
          .dispatch('user/login', {
            phone: '+' + this.registerForm.phone.replace(/\D/g, ''),
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
    onCountryChange () {
      this.registerForm.city = ''
    },
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin () {
      this.$router.push({
        path: '/login'
      })
    },
    handleRegister () {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.registerForm.phone = this.registerForm.phone.replace(/\D/g, '')
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
  width: 100%;
  background: #4da6ff;
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

  .auth_logo {
    text-align: center;

    img {
      width: 200px;
    }
  }

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
    grid-gap: 35px 16px;
    grid-template-areas: '. .' '. .' '. .' '. .' '. .' '. .' '. .' '. .' 'buttons buttons';
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

    &:not(.form_agreement) {
      position: relative;
      display: flex;
      flex-flow: column-reverse;
      margin-bottom: 0;

      label, input {
        transition: all 0.2s;
        touch-action: manipulation;
      }

      input {
        border: 0;
        border-bottom: 1px solid #ccc;
        font-family: inherit;
        -webkit-appearance: none;
        border-radius: 0;
        cursor: text;
      }

      input:focus {
        outline: 0;
        border-bottom: 1px solid #666;
      }

      &.address_map {
        label {
          text-transform: uppercase;
          letter-spacing: 0.05em;
          //transform: translate(10px, -483px) scale(1);
        }
      }

      label {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        //transform: translate(10px, -42px) scale(1);
        position: absolute;
        top: 0;
        left: 10px;
      }

      /**
      * Translate down and scale the label up to cover the placeholder,
      * when following an input (with placeholder-shown support).
      * Also make sure the label is only on one row, at max 2/3rds of the
      * field—to make sure it scales properly and doesn't wrap.
      */
      input:placeholder-shown + label {
        cursor: text;
        max-width: 66.66%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transform-origin: left bottom;
        transform: translate(0, 2.125rem) scale(1.5);
      }

      /**
      * By default, the placeholder should be transparent. Also, it should
      * inherit the transition.
      */
      ::-webkit-input-placeholder {
        opacity: 0;
        transition: inherit;
      }

      /**
      * Show the placeholder when the input is focused.
      */
      input:focus::-webkit-input-placeholder {
        opacity: 1;
      }

      /**
      * When the element is focused, remove the label transform.
      * Also, do this when the placeholder is _not_ shown, i.e. when
      * there's something in the input at all.
      */
      input:not(:placeholder-shown) + label {
        cursor: pointer;
      }

      &:focus-within {
        &.address_map {
          label {
            transform: translateY(-20px) scale(1);
          }
        }

        label {
          transform: translateY(-20px) scale(1);
        }
      }
    }
  }

  .el-form-item:nth-child(13) {
    z-index: 1;
    grid-column: 1/-1;

    .el-form-item__label {
      z-index: 3;

      a {
        text-decoration: underline;
        transition: color .3s;

        &:hover {
          color: #124d8a;
        }
      }
    }

    .el-form-item__content {
      z-index: -1;
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
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 15px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $bg inset !important;
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

  .address_map {
    grid-column: 1/-1;
    display: grid;

    .map-container {
      height: 200px;
    }

    input.el-input {
      color: $light_gray;
      padding: 12px 15px 12px 15px;
    }
  }

  .filled_label {
    &.address_map {
      label {
        transform: translateY(-20px) scale(1) !important;
      }
    }

    label {
      transform: translateY(-20px) scale(1) !important;
      cursor: pointer;
    }
  }

  .el-form-item__error {
    color: #ff0000;
  }

  .el-button--primary {
    background-color: #2b8cef;
  }
}

</style>
<style lang="scss" scoped>
$bg: #4da6ff;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
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
      margin: 0 auto 40px auto;
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
      grid-template-columns: 1fr;
      grid-template-areas:unset;
    }

    .register-form-buttons {
      grid-area: unset;
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


.form_agreement {
  grid-column: 1/-1;
}
</style>
