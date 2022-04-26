<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="6" md="8">
      <v-card>
        <v-card-title class="headline">
          Импорт Excel файла (xlsx)
        </v-card-title>
        <v-card-text>
          <p>Для начала работы, Вам необходимо загрузить файл.</p>
          <p v-show="message">
            {{ message }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-file-input
            v-model="excelFile"
            class="ml-2"
            :rules="rules"
            show-size
            accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            placeholder="Выберете файл excel"
            label="Excel"
            truncate-length="60"
          />
          <!-- <v-spacer /> -->
          <v-btn
            color="primary"
            class="ml-6 mr-6"
            :disabled="excelFile === null || (excelFile && excelFile.size > maxFileSize)"
            @click="loadFile"
          >
            Загрузить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <AlertDialog :dialog="isAlert" :message="alertMessage" btn-msg="Перейти" @close="closeAlert" />
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import importExcel from '../helpers/importExcel'
import AlertDialog from '../components/AlertDialog.vue'

const maxFileSize = 524288

export default {
  name: 'IndexPage',

  components: {
    AlertDialog
  },

  data: () => ({
    maxFileSize,
    rules: [
      value => !value || value.size < maxFileSize || 'Размер выбранного файла должен быть меньше 512 Kb!'
    ],
    excelFile: null,
    fileName: '',
    message: '',
    alertMessage: '',
    isAlert: false
  }),

  computed: {
    ...mapGetters({
      globalState: 'globalState/getGlobalState'
    })
  },

  mounted () {
    this.setIsLoadingExcel(false)
  },

  methods: {
    ...mapActions('globalState', [
      'setIsLoadingExcel',
      'setDataExcel'
    ]),

    closeAlert () {
      this.isAlert = false
      this.$router.push('/task1')
    },

    async loadFile (e) {
      if (this.excelFile) {
        const result = await importExcel(this.excelFile)

        if (result && !result.success) {
          this.message = 'Не удалось импортировать файл!'
          this.setIsLoadingExcel(false)
          if (result.errorMsg) {
            this.alertMessage = result.errorMsg
            this.isAlert = true
          }
        } else {
          this.message = `Файл ${this.excelFile.name} успешно загружен.`
          this.alertMessage = `Файл: "${this.excelFile.name}" - успешно загружен.</p>
          Будет осуществлён переход на страницу работы с файлом.`
          this.alertBtn = 'Перейти'
          this.isAlert = true
          this.setIsLoadingExcel(true)
          this.setDataExcel({ data: result.data, name: this.excelFile.name })
        }
      }
    }
  }
}
</script>
