<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="auth_logo">
        <img
          class="pic-404__parent"
          src="@/assets/img/logo.svg"
          alt="404"
        >
      </div>

      <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>
      </div>

      <lang-select class="lang hover-effect"/>

      <el-form-item prop="phone">
        <el-input placeholder="501000000"
                  maxlength="12"
                  minlength="12"
                  v-model="loginForm.phone"
                  v-mask="['## ###-##-##']"
        >
          <template slot="prepend">
            <vue-country-code
              @onSelect="onSelectCountry"
              :preferredCountries="['az', 'tr']">
            </vue-country-code>
          </template>
        </el-input>
        <!--        <el-input-->
        <!--          ref="phone"-->
        <!--          v-model="loginForm.phone"-->
        <!--          :placeholder="$t('login.phone')"-->
        <!--          name="phone"-->
        <!--          type="text"-->
        <!--          tabindex="1"-->
        <!--          auto-complete="on"-->
        <!--        />-->
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="$t('login.password')"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >{{ $t('login.title') }}
      </el-button>
      <div class="or">
        <span>{{ $t('or') }}</span>
      </div>
      <el-button
        type="secondary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleRegister"
      >{{ $t('register.title') }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect/index'
import validators from '@/utils/validators'
import VueCountryCode from 'vue-country-code'
import i18n from '@/lang'
import { mask } from 'vue-the-mask'

export default {
  name: 'Login',
  components: { LangSelect, VueCountryCode },
  directives: { mask },
  data () {
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(i18n.t('validator.phone.required')))
      } else if (value.length < 8) {
        callback(new Error(i18n.t('validator.phone.min')))
      } else {
        if (this.loginForm.prefix === '') {
          callback(new Error(i18n.t('validator.prefix.required')))
        }
        callback()
      }
    }
    const { phone, password } = validators()
    return {
      loginForm: {
        phone: '',
        password: '',
        prefix: ''
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [{ required: true, trigger: 'blur', validator: password }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: false
    }
  },
  methods: {
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
    handleRegister () {
      this.$router.push({
        path: '/register'
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', {
              phone: '+' + this.loginForm.prefix + this.loginForm.phone.replace(/\D/g, ''),
              password: this.loginForm.password
            })
            .then(() => {
              this.$router.push({ path: '/dashboard' })
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    onSelectCountry ({ name, iso2, dialCode }) {
      this.loginForm.prefix = dialCode
    },
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
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

  .el-input {
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px #4595e5 inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }

    .el-input-group__prepend {
      background-color: transparent;
      border: none;
      padding: 0;
      border-radius: 5px;

      .vue-country-select {
        border: none;
        height: 100%;

        .dropdown {
          border-radius: 5px;
        }

        .dropdown:hover, .dropdown.open {
          background-color: #4da6ff;
        }

        .dropdown-list {
          border: none;
          background-color: #4da6ff;
          z-index: 200;
        }
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;

    &.is-error {
      border-color: #F56C6C;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #4da6ff;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 60px 15px 60px;
    margin: 0 auto;
    overflow: hidden;
  }

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
    color: #000;
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
    top: 7px;
    font-size: 16px;
    color: #000000;
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
</style>
