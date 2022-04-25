<template>
  <ExcelTable
    :data-items="globalState.dataExcel.data"
    :file-name="globalState.dataExcel.name"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import ExcelTable from '../components/ExcelTable'

export default {
  name: 'TaskOne',

  components: {
    ExcelTable
  },

  computed: {
    ...mapGetters({
      globalState: 'globalState/getGlobalState'
    })
  }
}
</script>
