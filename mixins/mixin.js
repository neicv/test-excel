export default {
  data () {
    return {
      search: '',
      footer_props: {
        pageText: '{0} из {1}',
        itemsPerPageAllText: 'Все',
        itemsPerPageText: 'Строк на странице:',
        itemsPerPageOptions: [5, 15, 25, 50, -1]
      }
    }
  },

  computed: {
    themeState: {
      get () {
        return this.$vuetify.theme.dark ? 'dark' : 'light'
      },
      set (newValue) {
        return newValue
      }
    }
  },

  watch: {
    '$vuetify.theme.dark' (newValue) {
      this.themeState = newValue
    }
  },

  methods: {
    getAgregateContent (val = '', truncate = 0, format = false) {
      let str = val + ''

      if (str === '') {
        return ''
      }

      const arr = str.split('\n')
      let result = ''

      if (arr.length > 1) {
        arr.forEach((el, index) => {
          if (index !== arr.length) {
            result += this.truncateStr(el.trim(), truncate) + '<br />'
          }
        })
      } else {
        // Если цена, форматировать вывод
        if (format) {
          str = +val.toFixed(2)
        }
        return str
      }

      return `<span>${result}</span>`
    },

    truncateStr (str, n = 0) {
      if (!n) {
        return str
      }

      return (str.length > n) ? str.substr(0, n - 1) + '&hellip;' : str
    }
  }
}
