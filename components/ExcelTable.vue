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
              v-html="getAgregateContent(val, 0, key === columnKey[4])"
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
              :class="themeState"
            >
              <v-layout justify-end>
                {{ totalResult[field] }}
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
import mixin from '../mixins/mixin'
import {
  shemaMap as excelFields,
  expenses as expensesFields,
  total as totalFields,
  DEFAULT_DECIMAL_PLACES
} from '../config'

const DEFAULT_EXCLUDE_FIELD = 'price'

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
      DEFAULT_EXCLUDE_FIELD,
      pagination: {
        page: 0,
        pageCount: 0
      },
      totalFields: []
    }
  },

  computed: {
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
    },

    totalResult () {
      const res = {}

      // for (const field in Object.values(totalFields.fields)) {
      Object.values(totalFields.fields).forEach((field) => {
        let sum = this.sumField(field)
        if (sum && typeof sum === 'number') {
          sum = sum.toFixed(DEFAULT_DECIMAL_PLACES)
        }
        res[field] = sum
      })

      res[this.getFormulaCase(totalFields.formula)] = this.calculateFormula(res, totalFields.formula).toFixed(2)

      return res
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
      if (key === DEFAULT_EXCLUDE_FIELD) {
        return ''
      }

      let result = 0
      if (this.items && this.items.length) {
        result = this.items.reduce((a, b) => +a + (+b[key] || 0), 0)
      }

      return result
    },

    getItemClass (key) {
      let result = 'text-right'

      if (this.totalFields && this.totalFields.length) {
        result = this.totalFields.includes(key) ? 'text-right' : 'text-left'
      }

      return result
    },

    // Вычисление простой арифмитической формулы
    // Два числа и операнд - + * /
    // values объект в котором по ключам находятся данные
    // в формуле указаны ключи
    calculateFormula (values = '', formula = '') {
      if (!values || !formula) {
        return NaN
      }

      const realFormula = Object.values(formula)[0]

      if (!realFormula) {
        return NaN
      }
      const arr = realFormula.split(' ')
      if (!arr || arr.length === 0 || arr.length > 3) {
        return NaN
      }

      let res = ''
      try {
        const operator = arr[1]
        const a = +values[arr[0]]
        const b = +values[arr[2]]

        switch (operator) {
          case '+':
            res = a + b
            break

          case '-':
            res = a - b
            break

          case '*':
            res = a * b
            break

          case '/':
            res = a / b
            break

          default:
            res = NaN
            break
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('calc error: ', e)
      }

      return res
    },

    getFormulaCase (formula) {
      return Object.keys(formula)[0]
    }
  }
}
</script>

<style scoped>
  .te-table-total.dark {
    border: 1px solid white;
  }

  .te-table-total.light {
    border: 1px solid #565656;
  }
</style>
