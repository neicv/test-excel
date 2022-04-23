<template>
  <v-card v-if="globalState.dataExcel.data && globalState.dataExcel.data.length" width="100vw">
    <v-card-title>
      Файл: {{ globalState.dataExcel.name }}
      <v-spacer />
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
      <!-- <template
        #body.append="{ headers }"
      >
        <tr>
          <td :colspan="headers.length">
            На каждой секции
          </td>
        </tr>
      </template> -->
      <template
        v-if="isLastPage"
        slot="body.append"
      >
        <tr>
          <td :colspan="headers.length">
            На каждой секции
          </td>
        </tr>
      </template>
      <!-- <template
        #footer
      >
        <div>
          This is a footer
          <tr>
            <td :colspan="headers.length">
              На каждой секции
            </td>
          </tr>
        </div>
      </template> -->
    </v-data-table>
  </v-card>
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
import { shemaMap as excelFields, expenses as expensesFields } from '../config'

export default {
  name: 'InspirePage',

  data () {
    return {
      search: '',
      footer_props: {
        pageText: '{0} из {1}',
        itemsPerPageAllText: 'Все',
        itemsPerPageText: 'Строк на странице:',
        itemsPerPageOptions: [5, 15, 25, 50, -1]
      },
      pagination: {
        page: 0,
        pageCount: 0
      }
    }
  },

  computed: {
    ...mapGetters({
      globalState: 'globalState/getGlobalState'
    }),

    headers () {
      const field = []
      for (const key in excelFields) {
        field.push({ text: key, value: excelFields[key] })
      }

      if (field.length) {
        field[0].align = 'start'
      }
      // Добавление столбца затрат
      field.push({ text: expensesFields.text, value: expensesFields.value })

      return field
    },

    items () {
      const result = this.globalState.dataExcel.data || []
      let expenses = 0

      result.forEach((element) => {
        expenses = element[expensesFields.fields[0]] * element[expensesFields.fields[1]]
        element.expenses = +expenses.toFixed(2)
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
    }
  },

  methods: {
    changePageCount (pagination) {
      // eslint-disable-next-line no-console
      this.pagination = pagination
    }
  }
}
</script>
