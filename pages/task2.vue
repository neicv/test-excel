<template>
  <ExcelTable
    :data-items="items"
    :file-name="globalState.dataExcel.name"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import ExcelTable from '../components/ExcelTable'
import { shemaMap as excelFields } from '../config'

export default {
  name: 'TaskTwo',

  components: {
    ExcelTable
  },

  computed: {
    ...mapGetters({
      globalState: 'globalState/getGlobalState'
    }),

    items () {
      const data = this.globalState.dataExcel.data || []
      const newArr = []

      const fields = []
      // fields[0] - первый столбец данных екселя [МНН]
      // fields[1] - второй столбец данных екселя [Торговое наименование]
      // fields[2] - третий столбец данных екселя [Форма выпуска]
      // fields[3] - четвёртый столбец данных екселя [Количество]
      // fields[4] - четвёртый столбец данных екселя [Цена]

      for (const key in excelFields) {
        fields.push(excelFields[key])
      }

      data.forEach((val) => {
        if (newArr.filter(el => el[fields[0]] === val[fields[0]]).length === 0) {
          let tmpArr = []

          tmpArr = data.filter(el => el[fields[0]] === val[fields[0]])
          if (tmpArr) {
            const agregate = {}

            agregate[fields[0]] = tmpArr[0][fields[0]]
            agregate[fields[1]] = this.getAgregateValue(tmpArr, fields[1])
            agregate[fields[2]] = this.getAgregateValue(tmpArr, fields[2])
            // суммирование колличества
            agregate[fields[3]] = tmpArr.reduce((a, b) => +a + (+b[fields[3]] || 0), 0)
            // Средневзвешенная цена
            const average = tmpArr.reduce((a, b) => +a + (b[fields[3]] || 0) * (b[fields[4]] || 0), 0) / agregate[fields[3]]
            agregate[fields[4]] = average // .toFixed(2)

            newArr.push(agregate)
          }
        }
      })

      return newArr
    }
  },

  methods: {
    getAgregateValue (arr = [], val) {
      if (!val || !arr.length) {
        return ''
      }

      return [...new Set(arr.map(el => el[val]))].join('\n')
    }
  }
}
</script>
