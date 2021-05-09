<template>
  <div>
    <div
      v-for="(social, index) in social_links"
      :key="index"
      class="flex-social mb-2"
    >
      <el-input
        v-model="social['value']"
        placeholder="Link daxil edin"
        class="input-with-select"
      >
        <el-select
          :id="`social-network-${social['name']}`"
          slot="prepend"
          v-model="social['name']"
          value-key="name"
          placeholder="Select"
        >
          <el-option
            v-for="(soc, n_i) in socialNames"
            :key="n_i"
            :disabled="soc.disabled"
            :label="soc.name"
            :value="soc.name"
          />
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-plus"
          @click="addSocial(index)"
        />
        <el-button
          slot="append"
          type="danger"
          icon="el-icon-remove"
          @click="removeSocial(index)"
        />
      </el-input>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SocialAccounts',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mounted: false,
      select: '',
      socialAccounts: ['facebook', 'instagram', 'twitter', 'linkedin']
    }
  },
  computed: {
    social_links() {
      return this.value || [{ name: 'facebook', value: '' }]
    },
    socialNames() {
      const selectedSocials = this.social_links.map(soc => soc.name)
      const socialAccountsArray = this.socialAccounts.map(soc => {
        return {
          name: soc,
          disabled: false
        }
      })
      return socialAccountsArray.filter(soc => {
        if (selectedSocials.includes(soc.name)) {
          soc.disabled = true
        }
        return soc
      })
    }
  },
  watch: {
    // social_links: {
    //   deep: true,
    //   handler(val) {
    //     this.$emit(
    //       'input',
    //       val.filter(item => item.value)
    //     )
    //   }
    // }
  },
  methods: {
    addSocial() {
      if (this.social_links.length !== this.socialAccounts.length) {
        const notSelected = this.socialNames
          .filter(soc => !soc.disabled)
          .shift()
        const { name } = notSelected
        this.social_links.push({
          name,
          value: ''
        })
      }
    },
    removeSocial(index) {
      if (this.social_links.length !== 1) {
        this.social_links.splice(index, 1)
      } else {
        this.social_links[index].value = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.input-with-select {
  /deep/ .el-input {
    width: 110px !important;
  }
  .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
