<template>
  <div v-if="items && items.length" width="100vw">
    <v-card>
      <v-card-title>
        Файл: {{ fileName }}
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
        @pagination="changePageCount"
      >
        <template #item="{ item }">
          <tr>
            <!-- eslint-disable vue/no-v-html -->
            <td
              v-for="(val, key) in item"
              :key="key"
              :class="getItemClass(key)"
              v-html="getAgregateContent(key, val)"
            >
              <!-- {{ getAgregateContent(val) }} -->
            </td>
          </tr>
        </template>
        <template
          v-if="isLastPage"
          slot="body.append"
        >
          <tr>
            <td
              :colspan="colspanLength"
              class="title font-weight-bold"
            >
              <v-layout justify-end>
                Итого:
              </v-layout>
            </td>
            <td
              v-for="field in totalFields"
              :key="field"
              class="title font-weight-bold te-table-total"
            >
              <v-layout justify-end>
                {{ sumField(field) }}
              </v-layout>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
  <v-row v-else justify="center" align="center">
    <v-col cols="12" sm="6" md="8">
      <v-card>
        <v-card-title class="headline">
          Ошибка: файл не загружен!
        </v-card-title>
        <v-card-text>
          <p>Для начала работы, Вам необходимо загрузить файл.</p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import mixin from '../mixins/mixin'
import {
  shemaMap as excelFields,
  expenses as expensesFields,
  total as totalFields
} from '../config'

export default {
  name: 'ExcelTable',
  mixins: [mixin],
  props: {
    dataItems: {
      type: Array,
      required: true,
      default: () => ([])
    },
    fileName: {
      type: String,
      required: false,
      default: ''
    }
  },

  data () {
    return {
      pagination: {
        page: 0,
        pageCount: 0
      },
      totalFields: []
    }
  },

  computed: {
    ...mapGetters({
      globalState: 'globalState/getGlobalState'
    }),

    columnKey () {
      const fields = []
      for (const key in excelFields) {
        fields.push(excelFields[key])
      }

      return fields
    },

    headers () {
      const fields = []
      for (const key in excelFields) {
        fields.push({ text: key, value: excelFields[key] })
      }

      // Добавление столбца затрат
      fields.push({
        text: expensesFields.text,
        value: expensesFields.value,
        align: 'end'
      })

      // Заголовок - выравнивание
      if (fields.length && this.totalFields && this.totalFields.length) {
        fields.forEach((field) => {
          field.align = this.totalFields.includes(field.value) ? 'end' : 'start'
          field.class = this.totalFields.includes(field.value) ? 'text-right' : 'text-left'
        })
      }

      return fields
    },

    items () {
      const result = this.dataItems || []
      let expenses = 0

      result.forEach((element) => {
        expenses = element[expensesFields.fields[0]] * element[expensesFields.fields[1]]
        element.expenses = expenses.toFixed(2)
      })

      return result
    },

    totals () {
      const arr = this.items || []

      const result = arr.reduce((sum, current) => {
        return sum + current.quantity
      }, 0)

      return result
    },

    isLastPage () {
      return this.pagination.page === this.pagination.pageCount
    },

    colspanLength () {
      return this.headers.length - totalFields.fields.length
    }
  },

  mounted () {
    this.totalFields = totalFields.fields
  },

  methods: {
    changePageCount (pagination) {
      this.pagination = pagination
    },

    sumField (key) {
      // sum data in give key (property)
      let result = 0
      if (this.items && this.items.length) {
        result = this.items.reduce((a, b) => +a + (+b[key] || 0), 0)
      }

      return result.toFixed(2)
    },

    getItemClass (key) {
      let result = 'text-right'

      if (this.totalFields && this.totalFields.length) {
        result = this.totalFields.includes(key) ? 'text-right' : 'text-left'
      }

      return result
    },

    getAgregateContent (key, val = '') {
      let str = val + ''

      if (str === '') {
        return ''
      }

      const arr = str.split('\n')
      let result = ''

      if (arr.length > 1) {
        arr.forEach((el, index) => {
          if (index !== arr.length) {
            result += el.trim() + '<br />'
          }
        })
      } else {
        // Если цена, форматировать вывод
        if (key === this.columnKey[4]) {
          str = +val.toFixed(2)
        }
        return str
      }

      return `<span>${result}</span>`
    }
  }
}
</script>

<style scoped>
  .te-table-total {
    border: 1px solid white;
  }
</style>
