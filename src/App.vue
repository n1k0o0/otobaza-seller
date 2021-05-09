<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapGetters({
      token: 'user/token'
    })
  },
  watch: {
    async $route() {
      if (this.token) {
        await this.GET_ACCOUNT_STATUS()
      }
    }
  },
  methods: {
    ...mapActions({
      GET_ACCOUNT_STATUS: 'app/GET_ACCOUNT_STATUS'
    })
  }
}
</script>
