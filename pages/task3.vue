<template>
  <div v-if="items && items.length" width="80vw">
    <v-card>
      <v-card-title>
        Загрузка данных из базы SQLite DB
      </v-card-title>
    </v-card>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Поиск"
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table
        dense
        :headers="headers"
        :items="items"
        :search="search"
        :footer-props="footer_props"
        :items-per-page="15"
        class="elevation-1 text-truncate"
      >
        <template #item="{ item }">
          <tr v-if="item.hasOwnProperty('divider')">
            <td
              :colspan="headers.length"
              class="title font-weight-bold divider"
              :class="themeState"
              justify="center"
              align="center"
            >
              {{ item['divider'] }}
            </td>
          </tr>
          <tr v-else>
            <td> {{ item.count }} </td>
            <td :class="getColClass(DEFAULT_MNN)">
              {{ item[DEFAULT_MNN] }}
            </td>
            <!-- eslint-disable vue/no-v-html -->
            <td
              :class="getColClass(DEFAULT_MNN)"
              v-html="getAgregateContent(item[DEFAULT_TN], 64)"
            />
            <td> {{ item[DEFAULT_LSAEM] ? 'V' : 'N' }} </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
  <v-row v-else justify="center" align="center">
    <v-col cols="12" sm="6" md="8">
      <v-card>
        <v-progress-circular
          :size="70"
          :width="7"
          color="purple"
          indeterminate
          class="text-center"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import mixin from '../mixins/mixin'
import { tableRelationsTask3 as relationFields } from '../config'

// Международное непатентованное наименование
const DEFAULT_MNN = 'mnn'
// Торговое наименование
const DEFAULT_TN = 'tn'
// Жизненно необходимые и важнейшие лекарственные препараты
const DEFAULT_LSAEM = 'lsaem'

export default {
  name: 'TaskThree',
  mixins: [mixin],
  data () {
    return {
      DEFAULT_MNN,
      DEFAULT_TN,
      DEFAULT_LSAEM,
      count: 1,
      items: [],
      headers: [
        {
          text: '№',
          align: 'start',
          value: 'count',
          width: '10%',
          class: 'text-body-2 col-1',
          sortable: false
        },
        {
          text: [this.getField(DEFAULT_MNN).title],
          value: DEFAULT_MNN,
          width: '40%',
          class: 'text-body-2 col-6 text_truncate',
          align: 'start',
          sortable: false
        },
        {
          text: [this.getField(DEFAULT_TN).title],
          value: DEFAULT_TN,
          width: '40%',
          class: 'text-body-2 col-4 text_truncate',
          sortable: false
        },
        {
          text: [this.getField(DEFAULT_LSAEM).title],
          value: DEFAULT_LSAEM,
          width: '10%',
          class: 'text-body-2 col-1',
          align: 'start',
          sortable: false
        }
      ]
    }
  },

  async fetch () {
    const data = await this.$api('table', 'index')

    this.items = this.getItemsModel(data)
  },

  methods: {
    async fetch () {
      try {
        this.items = await this.$axios.$get('/api/table/index')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
        throw e
      }
    },

    getField (key) {
      return relationFields.find(el => el.value === key)
    },

    getColClass (key) {
      const res = this.headers.find(el => el.value === key)

      if (res && res) {
        return res.class
      }

      return ''
    },

    getItemsModel (data = []) {
      let items = []
      if (data && data.length) {
        // SQLite Не хранит bool данные, пожтому запрос возвращает
        // 1 как true и 0 как false !

        // Жизненно необходимые и важнейшие лекарственные препараты
        items = data.filter(el => +el[this.getField(DEFAULT_LSAEM).field] === 1)
        const partOne = this.getContentData(items)
        // Остальные
        items = data.filter(el => +el[this.getField(DEFAULT_LSAEM).field] === 0)
        const partTwo = this.getContentData(items)

        items = []
        items.push({ divider: 'ЛС в перечне ЖНВЛП' })
        items = [...items, ...partOne]
        items.push({ divider: 'Остальные ЛС' })
        items = [...items, ...partTwo]
      }

      return items
    },

    getContentData (items = []) {
      const arr = []

      items.forEach((el, index) => {
        const val = {}
        val.count = index + 1
        val[DEFAULT_MNN] = el[this.getField(DEFAULT_MNN).field]
        val[DEFAULT_TN] = el[this.getField(DEFAULT_TN).field]
        val[DEFAULT_LSAEM] = el[this.getField(DEFAULT_LSAEM).field] === 1

        arr.push(val)
      })

      return arr
    }
  }
}
</script>

<style scoped>
th, td {
  white-space: normal;
}
.divider.dark {
  background: #5e5b77;
}
.divider.light {
  background: #d2cff0;
  color: #565656
}
</style>
