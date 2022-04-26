<template>
  <div id="theme-togele">
    <v-container>
      <div class="flex">
        <span class="mt-3">
          <v-list-item-title class="pr-10">
            {{ darkmode ? 'Dark Mode' : 'Light Mode' }}
          </v-list-item-title>
          <v-switch
            v-model="darkmode"
            color="primary"
          />
        </span>
        <span class="mt-3">
          <v-icon class="mr-1">
            mdi-brightness-4
          </v-icon>
        </span>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'ThemeTpggler',
  data () {
    return {
      darkmode: false
    }
  },
  watch: {
    darkmode (oldval, newval) {
      this.handledarkmode()
    }
  },
  created () {
    if (process.browser) {
      if (localStorage.getItem('test-excel/DarkMode')) {
        const cookieValue = localStorage.getItem('test-excel/DarkMode') === 'true'
        this.darkmode = cookieValue
        this.$vuetify.theme.dark = cookieValue
      } else {
        this.handledarkmode()
      }
    }
  },
  methods: {
    handledarkmode () {
      if (process.browser) {
        if (this.darkmode === true) {
          this.$vuetify.theme.dark = true
          localStorage.setItem('test-excel/DarkMode', true)
        } else if (this.darkmode === false) {
          this.$vuetify.theme.dark = false
          localStorage.setItem('test-excel/DarkMode', false)
        }
      }
    }
  }
}
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: flex-end;
}
</style>
