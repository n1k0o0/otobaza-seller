<template>
  <div class="PageContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="Breadcrumbs">
      <el-breadcrumb-item :to="{ path: '/' }">{{
          $t('dashboard.title')
        }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('profile.title') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card v-loading="loading" shadow="always">
      <template slot="header">
        <h2>{{ $t('profile.title') }}</h2>
      </template>
      <div class="profile-form">
        <h3>{{ $t('profile.profile_details') }}:</h3>
        <el-form
          ref="profile"
          :loading="loading"
          :model="profile"
          :rules="profileRules"
          class="register-form"
          auto-complete="on"
          label-position="top"
        >
          <el-form-item prop="first_name" :label="$t('register.first_name')">
            <el-input v-model="profile.first_name" />
          </el-form-item>

          <el-form-item prop="last_name" :label="$t('register.last_name')">
            <el-input v-model="profile.last_name" />
          </el-form-item>

          <el-form-item prop="currency" :label="$t('register.currency')">
            <el-select
              v-model="profile.currency"
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
              v-model="profile.country"
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
              v-model="profile.city"
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
            <el-input v-model="profile.store_name" />
          </el-form-item>

          <el-form-item prop="store_about" :label="$t('register.store_about')">
            <el-input v-model="profile.store_about" type="textarea" />
          </el-form-item>

          <el-form-item prop="address" :label="$t('register.address')">
            <el-input v-model="profile.address" type="textarea" />
          </el-form-item>

          <el-form-item :label="$t('profile.social_accounts')">
            <SocialAccounts v-model="profile.social_links" />
          </el-form-item>

          <div class="register-form-buttons">
            <el-button
              :loading="loading"
              type="primary"
              @click.native.prevent="handleRegister"
            >{{ $t('profile.save') }}
            </el-button>
          </div>
        </el-form>
      </div>
      <el-divider />
      <div class="profile-form">
        <h3>Email :</h3>
        <el-form
          ref="profileEmail"
          :loading="loading"
          :model="profile"
          :rules="profileRules"
          class="register-form"
          auto-complete="on"
          label-position="top"
        >
          <el-form-item prop="email" :label="$t('register.email')">
            <el-input v-model="profile.email" type="email" />
          </el-form-item>
          <div class="register-form-buttons">
            <el-button
              :loading="loading"
              type="primary"
              @click.native.prevent="handleEmail"
            >{{ $t('profile.save') }}
            </el-button>
          </div>
        </el-form>
      </div>
      <el-divider />
      <div class="profile-form">
        <h3>{{ $t('profile.password_reset') }}:</h3>
        <el-form
          ref="profilePassword"
          :loading="loading"
          :model="profile"
          :rules="profileRules"
          class="register-form"
          auto-complete="on"
          label-position="top"
        >
          <el-form-item prop="password" :label="$t('register.password')">
            <el-input v-model="profile.password" :type="passwordType" />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
          <el-form-item
            prop="password_confirmation"
            :label="$t('register.password_confirmation')"
          >
            <el-input
              v-model="profile.password_confirmation"
              :type="passwordType"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
          <div class="register-form-buttons">
            <el-button
              :loading="loading"
              type="primary"
              native-type="submit"
              @click.native.prevent="handlePassword"
            >{{ $t('profile.save') }}
            </el-button>
          </div>
        </el-form>
      </div>
      <el-divider />
      <div class="profile-form">
        <h3>{{ $t('profile.phone_reset') }}:</h3>
        <el-form
          ref="profilePhone"
          :loading="loading"
          :model="profile"
          :rules="profileRules"
          class="register-form"
          auto-complete="on"
          label-position="top"
        >
          <el-form-item prop="phone" :label="$t('register.phone')">
            <el-input v-model="profile.phone" />
          </el-form-item>
          <div class="register-form-buttons">
            <el-button
              :loading="loading"
              type="primary"
              native-type="submit"
              @click.native.prevent="handlePhone"
            >{{ $t('profile.save') }}
            </el-button>
          </div>
        </el-form>
        <el-dialog :visible.sync="otpShow" width="30%">
          <div class="mb-1">{{ $t('otp.title') }}</div>
          <el-input v-model="otp" class="otp_input" />
          <template slot="footer" class="dialog-footer">
            <el-button @click="otpShow = false">{{ $t('cancel') }}</el-button>
            <el-button
              type="primary"
              :disabled="isOtpDisabled"
              @click.prevent="submitOtp"
            >{{ $t('confirm') }}
            </el-button>
          </template>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import SocialAccounts from '@/components/SocialAccounts'
import i18n from '@/lang'
import validators from '@/utils/validators'
import { Message } from 'element-ui'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Profile',
  components: { SocialAccounts },
  data() {
    const {
      first_name,
      last_name,
      phone,
      country,
      city,
      password,
      store_name
    } = validators()

    const password_confirmation = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error(i18n.t('validator.password.min')))
      } else if (value !== this.profile.password) {
        callback(new Error(i18n.t('validator.password.not_equal')))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      passwordType: 'password',
      otpShow: false,
      otp: '',
      profile: {
        password: '',
        password_confirmation: '',
        first_name: '',
        last_name: '',
        phone: '',
        group_id: 2,
        currency: '',
        country: '',
        city: '',
        email: '',
        address: '',
        store_name: '',
        store_about: '',
        latitude: '',
        longitude: '',
        social_links: []
      },
      profileRules: {
        first_name: [
          { required: true, trigger: 'change', validator: first_name }
        ],
        last_name: [
          { required: true, trigger: 'change', validator: last_name }
        ],
        phone: [{ required: true, trigger: 'change', validator: phone }],
        country: [{ required: true, trigger: 'change', validator: country }],
        city: [{ required: true, trigger: 'change', validator: city }],
        password: [{ required: true, trigger: 'change', validator: password }],
        password_confirmation: [
          {
            required: true,
            trigger: 'change',
            validator: password_confirmation
          }
        ],
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
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      token: 'user/token'
    }),
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
        item => item.id === this.profile.country
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
  async beforeMount() {
    this.loading = true
    await this.GET_CURRENCIES()
    await this.GET_SETTINGS()
    await this.getProfile()
    this.loading = false
  },
  methods: {
    ...mapActions({
      GET_CURRENCIES: 'app/GET_CURRENCIES',
      GET_SETTINGS: 'app/GET_SETTINGS',
      SEND_OTP: 'user/SEND_OTP',
      UPDATE_PROFILE: 'user/UPDATE_PROFILE',
      CHANGE_EMAIL: 'user/CHANGE_EMAIL',
      CHANGE_PASSWORD: 'user/CHANGE_PASSWORD',
      CHANGE_PHONE: 'user/CHANGE_PHONE'
    }),
    async getProfile() {
      await new Promise(resolve => {
        const {
          first_name,
          last_name,
          currency,
          country,
          city,
          store_name,
          store_about,
          address,
          email,
          social_links,
          phone
        } = this.user
        this.profile.phone = phone
        this.profile.first_name = first_name
        this.profile.last_name = last_name
        this.profile.currency = currency.id
        this.profile.country = country.id
        this.profile.city = city.id
        this.profile.store_name = store_name
        this.profile.store_about = store_about
        this.profile.address = address
        this.profile.email = email
        this.profile.social_links = social_links
        resolve()
      })
    },
    onCountryChange() {
      this.profile.city = ''
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleRegister() {
      this.$refs.profile.validate(valid => {
        if (valid) {
          this.loading = true
          const country = this.$store.getters['app/countries'].find(
            item => item.id === this.profile.country
          )
          const { lat, lng } = country.cities.find(
            city => city.id === this.profile.city
          )

          this.profile.latitude = lat
          this.profile.longitude = lng
          this.profile.socials = this.profile.social_links
          const profile = JSON.parse(JSON.stringify(this.profile))
          delete profile['phone']
          delete profile['password']
          delete profile['password_confirmation']
          delete profile['email']
          delete profile['social_links']
          this.UPDATE_PROFILE(profile)
            .then(response => {
              if (response?.data?.message) {
                Message({
                  message: response?.data?.message,
                  type: 'success',
                  duration: 5 * 1000
                })
              }
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    handleEmail() {
      this.$refs.profileEmail.validate(valid => {
        if (valid) {
          this.loading = true
          this.CHANGE_EMAIL(this.profile.email).finally(() => {
            this.loading = false
          })
        }
      })
    },
    handlePassword() {
      this.$refs.profilePassword.validate(valid => {
        if (valid) {
          this.loading = true
          const { password, password_confirmation } = this.profile
          this.CHANGE_PASSWORD({
            password,
            password_confirmation
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    handlePhone() {
      this.$refs.profilePhone.validate(valid => {
        if (valid) {
          this.loading = true
          const { phone } = this.profile
          this.CHANGE_PHONE(phone)
            .then(() => {
              this.otpShow = true
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    async submitOtp() {
      const token = this.user.token
      const code = +this.otp
      await this.SEND_OTP({
        code,
        token
      }).then(response => {
        this.loading = true
        Message({
          message: response?.data?.message,
          type: 'success',
          duration: 5 * 1000
        })
        this.otpShow = false
        this.otp = ''
      })
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.show-pwd {
  position: absolute;
  right: 10px;
  bottom: 1px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}

.otp_input {
  width: 100%;
}

.profile-form {
  max-width: 600px;
  width: 100%;

  .el-select {
    width: 100%;
  }
}
</style>
