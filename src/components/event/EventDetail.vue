<template>
  <v-dialog
    v-model="show"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card tile>
      <v-toolbar card dark color="primary">
        <v-btn icon dark @click="closeFn">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{title}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text v-if="!isLoading" class="text-xs-center">
        <v-container xs12 sm10 md6>
          {{eventData}}
        </v-container>
      </v-card-text>
      <v-container v-if="isLoading" class="text-xs-center">
        <v-progress-circular
          :width="6"
          indeterminate
          color="primary">
        </v-progress-circular>
      </v-container>
      <div style="flex: 1 1 auto;"></div>
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from 'axios'
  import localForage from 'localforage'

  export default {
    props: ['show', 'eventId', 'title'],
    data () {
      return {
        eventData: {},
        isLoading: true,
        loadingFailed: false,
      }
    },
    methods: {
      closeFn () {
        this.$emit('close-fn')
      },
      loadEventData () {
        axios.get(`${this.$config.apiBaseUrl}/api/event/detail?id=${this.eventId}`)
        .then(response => {
          console.log('from network', response.data);
          localForage.setItem(`event_${this.eventId}`, JSON.stringify(response.data))
          this.eventData = response.data
          this.isLoading = false
        })
        .catch(err => {
        localForage.getItem(`event_${this.eventId}`)
          .then(event => {
            console.log('from localforage', event);
            if (event) {
              this.eventData = JSON.parse(event)
              this.offline = true
            }
            else {
              this.loadingFailed = true
            }
            this.isLoading = false
          })
          .catch(err => {
            console.log(err)
            this.loadingFailed = true
            this.isLoading = false
          })
        })
      }
    },
    watch: {
      show (val) {
        if (val) {
          this.loadEventData()
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        // this.loadEventData()
      })
    }
  }
</script>
