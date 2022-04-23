<template>
  <div class="text-center">
    <v-dialog
      v-model="open"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5">
          Сообщение системы
        </v-card-title>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <v-card-text v-html="message" />

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="close"
          >
            {{ btnMsg }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'AlertDialog',

  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    },
    btnMsg: {
      type: String,
      default: 'OK'
    }
  },

  data: () => ({
    open: false
  }),

  watch: {
    dialog (value) {
      this.open = value
    }
  },

  create () {
    this.open = this.dialog
  },

  methods: {
    close () {
      this.open = false
      this.$emit('close')
    }
  }
}
</script>
