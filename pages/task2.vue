<template>
  <v-card v-if="globalState.dataExcel.data && globalState.dataExcel.data.length" width="100vw">
    <v-card-title>
      Файл: {{ globalState.dataExcel.name }}
      <v-spacer />
    </v-card-title>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
// import {
//   shemaMap as excelFields,
//   expenses as expensesFields,
//   total as totalFields
// } from '../config'

export default {
  name: 'TaskTwo',

  computed: {
    ...mapGetters({
      globalState: 'globalState/getGlobalState'
    })
  }
}

</script>
