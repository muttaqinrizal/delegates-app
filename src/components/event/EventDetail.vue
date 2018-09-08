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
          <v-layout row wrap mb-4>
            <v-flex xs9>
              <div style="padding-left: 10px;">
                <div style="text-align: left; margin-bottom: 8px;">
                  <strong>{{ eventData.title }}</strong>
                  <span class="now" v-if="eventData.now">Sekarang</span>
                </div>
                <div class="bullet dresscode" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                  {{ eventData.dresscode }}
                </div>
                <div class="bullet time" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                  {{ eventData.time.start }} - {{ eventData.time.end }} WIB
                </div>
                <div class="bullet date" style="text-align: left; line-height: normal; margin-bottom: 4px;">
                  {{ eventData.date || '-'}}
                </div>
                <div class="bullet location" style="text-align: left;">
                  {{ eventData.location }}
                </div>
              </div>
            </v-flex>
            <v-flex d-flex xs3>
              <img :key="new Date().getTime()" :src="getApiPicture(eventData.image)" style="height: 120px; width: auto;">
            </v-flex>
          </v-layout>
          <v-layout>
            a
          </v-layout>
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
  import commons from '../../libs/commons.js'

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
      getApiPicture(name) {
        return commons.getApiPicture(name)
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
