<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          :disabled="item.disabled"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-layout justify-end>
        <v-list-item-content>
          <ThemeToggler />
        </v-list-item-content>
      </v-layout>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import ThemeToggler from '../components/ThemeToggler.vue'

export default {
  name: 'DefaultLayout',
  components: { ThemeToggler },
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Импорт',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Задание 1',
          to: '/task1',
          disabled: true
        },
        {
          icon: 'mdi-firework',
          title: 'Задание 2',
          to: '/task2',
          disabled: true
        },
        {
          icon: 'mdi-table',
          title: 'Задание 3',
          to: '/task3',
          disabled: false
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      mainTitle: 'Тестовое задание: ',
      title: ''
    }
  },

  computed: {
    ...mapGetters({
      globalState: 'globalState/getGlobalState'
    }),

    currentRoutePath () {
      return this.$route.path
    }
  },

  watch: {
    'globalState.isLoadingExcel' (newValue) {
      this.items.forEach((element, index) => {
        if (index !== 0) {
          element.disabled = !newValue
        }
      })
    },

    $route (newVal, oldVal) {
      this.setTitleName(newVal.path)
    }
  },

  mounted () {
    this.items.forEach((element, index) => {
      // Загрузка и Задание 3 доступны по-умолчанию
      if (index !== 0 && index !== 3) {
        element.disabled = true
      }
    })

    this.setTitleName(this.currentRoutePath)
  },

  methods: {
    setTitleName (path) {
      const title = this.items.find(el => el.to === path)

      if (title) {
        this.title = this.mainTitle + title.title
      }
    }
  }
}
</script>
