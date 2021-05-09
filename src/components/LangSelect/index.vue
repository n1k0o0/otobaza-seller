<template>
  <el-dropdown
    trigger="click"
    class="international"
    @command="handleSetLanguage"
  >
    <div><svg-icon icon-class="language" /> {{ language.toUpperCase() }}</div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-if="language !== 'az'" command="az">
        AZ
      </el-dropdown-item>
      <el-dropdown-item v-if="language !== 'ru'" command="ru">
        RU
      </el-dropdown-item>
      <el-dropdown-item v-if="language !== 'en'" command="en">
        EN
      </el-dropdown-item>
      <el-dropdown-item v-if="language !== 'tr'" command="tr">
        TR
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'LangSelect',
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('app/setLanguage', lang)
      this.$router.go()
    }
  }
}
</script>
