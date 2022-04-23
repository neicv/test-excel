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
      :items="globalState.dataExcel.data"
      :search="search"
      :footer-props="footer_props"
      :items-per-page="15"
      class="elevation-1 text-truncate"
    />
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
import { shemaMap as excelFields } from '../config'

export default {
  name: 'InspirePage',

  data () {
    return {
      search: '',
      // headers: [
      //   {
      //     text: 'Dessert (100g serving)',
      //     align: 'start',
      //     sortable: false,
      //     value: 'name'
      //   },
      //   { text: 'Calories', value: 'calories' },
      //   { text: 'Fat (g)', value: 'fat' },
      //   { text: 'Carbs (g)', value: 'carbs' },
      //   { text: 'Protein (g)', value: 'protein' },
      //   { text: 'Iron (%)', value: 'iron' }
      // ],
      footer_props: {
        pageText: '{0} из {1}',
        itemsPerPageAllText: 'Все',
        itemsPerPageText: 'Строк на странице:',
        itemsPerPageOptions: [5, 15, 25, 50, -1]
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
        // console.log(key, ':', shemaMap[key]);
        // {
        //   text: 'Dessert (100g serving)',
        //   align: 'start',
        //   sortable: false,
        //   value: 'name'
        // },
        field.push({ text: key, value: excelFields[key] })
      }

      if (field.length) {
        field[0].align = 'start'
      }
      return field
    }
  }
}
</script>
